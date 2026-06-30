"""
WhatsApp Payment Integration API endpoints
"""

import httpx
import os
import hmac
import hashlib
from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy.orm import Session
from datetime import datetime

from src.models.database import get_db
from src.models import Order
from src.schemas import WhatsAppMessage, WhatsAppPaymentLink
from src.payment_processor import process_payment_webhook

router = APIRouter()

# WhatsApp Configuration
WHATSAPP_API_TOKEN = os.getenv("WHATSAPP_API_TOKEN")
WHATSAPP_PHONE_NUMBER_ID = os.getenv("WHATSAPP_PHONE_NUMBER_ID")
WHATSAPP_API_URL = "https://graph.facebook.com/v18.0"
WEBHOOK_VERIFY_TOKEN = os.getenv("WEBHOOK_VERIFY_TOKEN", "zaitoun-webhook-token")
WEBHOOK_APP_SECRET = os.getenv("WHATSAPP_API_TOKEN")


@router.post("/send-message")
async def send_whatsapp_message(
    phone_number: str,
    message: str,
    component_name: str = "button",
    button_text: str = "Contact Us"
):
    """Send a WhatsApp message to customer"""
    if not WHATSAPP_API_TOKEN or not WHATSAPP_PHONE_NUMBER_ID:
        raise HTTPException(
            status_code=500,
            detail="WhatsApp API not configured. Please contact support."
        )

    payload = {
        "messaging_product": "whatsapp",
        "to": phone_number,
        "type": "text",
        "text": {
            "body": message
        }
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                f"{WHATSAPP_API_URL}/{WHATSAPP_PHONE_NUMBER_ID}/messages",
                headers={
                    "Authorization": f"Bearer {WHATSAPP_API_TOKEN}",
                    "Content-Type": "application/json"
                },
                json=payload,
                timeout=30.0
            )
            response.raise_for_status()
            return {"success": True, "data": response.json()}
    except httpx.HTTPError as e:
        raise HTTPException(status_code=500, detail=f"Failed to send WhatsApp message: {str(e)}")


@router.post("/payment-link")
async def create_payment_link(
    phone_number: str,
    amount: float,
    description: str,
    order_number: str,
    db: Session = Depends(get_db)
):
    """Generate WhatsApp payment link and update order"""
    # Validate order exists
    order = db.query(Order).filter(Order.order_number == order_number).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Create payment message
    message = (
        f"*Zaitoun Loralai Payment Request*\n\n"
        f"Order: {order_number}\n"
        f"Amount: ${amount:.2f}\n"
        f"Description: {description}\n\n"
        f"Please confirm payment via WhatsApp."
    )

    return {
        "success": True,
        "wa_link": f"https://wa.me/{phone_number}?text={message}",
        "message": message
    }


def verify_webhook_signature(request_body: str, signature: str) -> bool:
    """
    Verify WhatsApp webhook signature using HMAC SHA256
    Signature format: sha256=<hash>
    """
    if not WEBHOOK_APP_SECRET:
        raise HTTPException(
            status_code=500,
            detail="Webhook app secret not configured"
        )

    expected_signature = hmac.new(
        WEBHOOK_APP_SECRET.encode(),
        request_body.encode(),
        hashlib.sha256
    ).hexdigest()

    # Extract hash from signature header (format: sha256=hash)
    if not signature or "=" not in signature:
        return False

    _, provided_hash = signature.split("=", 1)
    return hmac.compare_digest(expected_signature, provided_hash)


@router.post("/webhook")
async def whatsapp_webhook(request: Request, db: Session = Depends(get_db)):
    """
    WhatsApp webhook endpoint for receiving payment notifications
    This is called by Meta when a customer responds to a message
    Signature verification prevents fake webhook requests

    Processes payment confirmations by:
    1. Verifying webhook signature
    2. Extracting order number from message
    3. Checking for payment confirmation keywords
    4. Updating order status to 'paid' and 'confirmed'
    """
    # Get raw body for signature verification
    body = await request.body()
    body_str = body.decode("utf-8")

    # Get signature from headers
    signature = request.headers.get("X-Hub-Signature-256", "")

    # Verify webhook signature
    if not verify_webhook_signature(body_str, signature):
        raise HTTPException(
            status_code=403,
            detail="Invalid webhook signature"
        )

    try:
        data = await request.json()
    except Exception as e:
        raise HTTPException(
            status_code=400,
            detail="Invalid JSON payload"
        )

    # Log webhook for debugging
    print("WhatsApp Webhook received (verified):", data)

    # Verify it's a message from customer
    if data.get("object") == "whatsapp_business_account":
        entry = data.get("entry", [])
        if entry:
            changes = entry[0].get("changes", [])
            for change in changes:
                if change.get("field") == "messages":
                    messages = change.get("value", {}).get("messages", [])
                    for message in messages:
                        if message.get("type") == "text":
                            # Extract message details
                            from_number = message.get("from")
                            message_id = message.get("id")
                            text = message.get("text", {}).get("body", "")

                            print(f"Received message from {from_number}: {text}")

                            # Process payment confirmation
                            result = process_payment_webhook(
                                message_text=text,
                                from_phone=from_number,
                                message_id=message_id,
                                db=db
                            )

                            print(f"Payment processing result: {result}")

                            # Log the result
                            if result['success']:
                                print(f"SUCCESS: {result['message']}")
                            else:
                                print(f"INFO: {result['message']}")

    return {"success": True}


@router.get("/template")
async def get_payment_template(
    order_number: str,
    amount: float,
    db: Session = Depends(get_db)
):
    """Get a standardized payment template message"""
    order = db.query(Order).filter(Order.order_number == order_number).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    template = (
        f"*Zaitoun Loralai - Payment Confirmation*\n\n"
        f"Thank you for your order!\n\n"
        f"Order Details:\n"
        f"Order Number: {order_number}\n"
        f"Total Amount: ${amount:.2f}\n\n"
        f"To complete your order, please send payment via WhatsApp.\n\n"
        f"Once payment is confirmed, your order will be processed immediately."
    )

    return {
        "success": True,
        "template": template,
        "order": order.to_dict()
    }
