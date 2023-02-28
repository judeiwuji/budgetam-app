# ------------------
# Create a campaign\
# ------------------
# Include the Sendinblue library\
from __future__ import print_function
import time
import sib_api_v3_sdk
from sib_api_v3_sdk import AccountApi, ApiClient, Configuration, SendSmtpEmailTo
from sib_api_v3_sdk.rest import ApiException
from pprint import pprint
# Instantiate the client\
configuration = Configuration()
configuration.api_key['api-key'] = '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'

# create an instance of the API class
api_instance = sib_api_v3_sdk.TransactionalEmailsApi(sib_api_v3_sdk.ApiClient(configuration))
subject = "from the Python SDK!"
sender = {"name":"Sendinblue","email":"contact@sendinblue.com"}
replyTo = {"name":"Sendinblue","email":"contact@sendinblue.com"}
html_content = "<html><body><h1>This is my first transactional email </h1></body></html>"
to = [{"email":"ekottifiok@gmail.com","name":"Jane Doe"}]
params = {"parameter":"My param value","subject":"New Subject"}
send_smtp_email = sib_api_v3_sdk.SendSmtpEmail(to=to, reply_to=replyTo, html_content=html_content, sender=sender, subject=subject)

try:
    api_response = api_instance.send_transac_email(send_smtp_email)
    print(api_response)
except ApiException as e:
    print("Exception when calling SMTPApi->send_transac_email: %s\n" % e)



# api_instance = sib_api_v3_sdk.EmailCampaignsApi()
# # Define the campaign settings\
# email_campaigns = sib_api_v3_sdk.CreateEmailCampaign(
#     name="Campaign sent via the API",
#     subject="My subject",
#     sender={"name": "From name", "email": "anshuman.kashyap@sendinblue.com"},
    
#     # Content that will be sent\
#     html_content="Congratulations! You successfully sent this example campaign via the Sendinblue API.",
#     # Select the recipients\
#     recipients={"listIds": [2, 7]},
#     # Schedule the sending in one hour\
#     scheduled_at="2018-01-01 00:00:01"
# )
# # Make the call to the client\
# try:
#     api_response = api_instance.create_email_campaign(email_campaigns)
#     pprint(api_response)
# except ApiException as e:
#     print("Exception when calling EmailCampaignsApi->create_email_campaign: %s\n" % e)
