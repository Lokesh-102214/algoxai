import boto3
import os
from datetime import datetime, timedelta, timezone

# Credentials are read from environment variables or ~/.aws/credentials
# Set them via: $env:AWS_ACCESS_KEY_ID, $env:AWS_SECRET_ACCESS_KEY, $env:AWS_DEFAULT_REGION
logs = boto3.client(
    'logs',
    region_name=os.environ.get('AWS_DEFAULT_REGION', 'us-east-1')
)

log_group = '/aws/lambda/algoxai-orchestrator'
start = int((datetime.now(timezone.utc) - timedelta(minutes=30)).timestamp() * 1000)

try:
    events = logs.filter_log_events(logGroupName=log_group, startTime=start, limit=100)
    msgs = [e['message'] for e in events['events']]
    if msgs:
        print(''.join(msgs))
    else:
        print('NO LOGS in last 30 min — Lambda has not been invoked.')
except logs.exceptions.ResourceNotFoundException:
    print('Log group does not exist — Lambda was never invoked.')
except Exception as ex:
    print('Error:', ex)
