from celery import shared_task
import time

@shared_task
def send_booking_confirmation_sms(phone_number, parent_name, student_id, time_slot, teacher_name):
    """
    Mock implementation of Twilio SMS sending.
    In a real app, this would use the twilio python client.
    """
    print(f"[ASYNC TASK STARTED] Preparing to send SMS to {phone_number}...")
    
    # Simulate network delay to Twilio API
    time.sleep(2)
    
    message = f"Hi {parent_name}, your PTM slot for {student_id} with {teacher_name} at {time_slot} is confirmed."
    print(f"[SMS SENT] To: {phone_number} | Message: {message}")
    
    return "SMS Sent successfully"

@shared_task
def send_booking_confirmation_email(email_address, parent_name, student_id, time_slot, teacher_name):
    """
    Mock implementation of SendGrid/AWS SES email sending.
    """
    print(f"[ASYNC TASK STARTED] Preparing to send Email to {email_address}...")
    
    # Simulate network delay to Email API
    time.sleep(3)
    
    message = f"Hi {parent_name},\n\nYour PTM slot for {student_id} with {teacher_name} at {time_slot} is confirmed.\n\nPlease be on time."
    print(f"[EMAIL SENT] To: {email_address} | Body: {message}")
    
    return "Email Sent successfully"
