import time
from gpiozero import PWMLED
from time import sleep
import RPi.GPIO as GPIO
from google.cloud import pubsub_v1
import ast

class Torch:
                              #TORCH PINS
    inpr = PWMLED(27)
    inox = PWMLED(25)
    ospr = PWMLED(23)
    osox = PWMLED(24)

    def __init__(self):
        self.data = []

    def on(self, inpr_val, inox_val, ospr_val=0, osox_val=0):
        inpr = self.inpr
        inox = self.inox
        ospr = self.ospr
        osox = self.osox
        inpr.value = inpr_val
        inox.value = inox_val
        ospr.value = ospr_val
        osox.value = osox_val
        print("torch on")


    def off(self):
        inpr = self.inpr
        inox = self.inox
        ospr = self.ospr
        osox = self.osox
        inpr.value = 0
        inox.value = 0
        ospr.value = 0
        osox.value = 0
        print("torch off")









































































flame = {
'IP': '100',
'IO': '100',
'OP': '100',
'OO': '100',
}



mirage = Torch()

mirage.on(float(flame['IP'])/100, float(flame['IO'])/100, float(flame['OP'])/100, float(flame['OO'])/100)













project_id = "glassphonix"
subscription_name = "my-subscription"

subscriber = pubsub_v1.SubscriberClient()
# The `subscription_path` method creates a fully qualified identifier
# in the form `projects/{project_id}/subscriptions/{subscription_name}`
subscription_path = subscriber.subscription_path(
    project_id, subscription_name)

def callback(message):


    print('Received message1: {}'.format(message))
    print('start Cycle')
    print('Received message2: {}'.format(message.data).split('@')[1])
    #flameSettings = ast.listeral_eval(message.data.split('@')[1])
    #flame['IP'] = flameSettings['IP']
    #flame['IO'] = flameSettings['IO']
    #flame['OP'] = flameSettings['OP']
    #flame['OO'] = flameSettings['OO']
    #print('flameip', flame['IP'])
    print('end cycle')

    message.ack()

subscriber.subscribe(subscription_path, callback=callback)

# The subscriber is non-blocking. We must keep the main thread from
# exiting to allow it to process messages asynchronously in the background.
print('Listening for messages on {}'.format(subscription_path))
while True:
    time.sleep(60)
