
# Alexa - New York Running Calendar

An Amazon Alexa skill for finding out when and where the next running race is being held in New York City.

## Usage

```
User: "Alexa, ask New York Running Calendar when the next race is."
Alexa: "The Japan Run 4 Miler is in Central Park on Sunday May 8th starting at 8:00 AM.  Would you like to hear more?"

```

```
User: "Alexa, start New York Running Calendar."
Alexa: "Welcome to the New York Running Calendar app. You can ask me when the next race is."

User: "When's the next race?"
Alexa: "The Japan Run 4 Miler is in Central Park on Sunday May 8th starting at 8:00 AM.  Would you like to hear more?"

User: "No."
```

## Setup

### Build the App

```
pushd ./src
npm install
popd
```

### Create the lambda function

Set your target aws profile

```
export AWS_PROFILE=<profile>
```

Build the zip

```
./scripts/build_zip.sh
```

Create the lambda function

```
./scripts/lambda_function_create.sh
```

Update the function

```
./scripts/lambda_function_update.sh
```

Copy the value of ```FunctionArn``` in the response json for use below.

### Create the Alexa skill

Go to the

[Build Alexa Skills with the Alexa Skills Kit](https://developer.amazon.com/edw/home.html#/skills/list)

__Skill Infomation__

- Set the __Skill Type__ to "Custom Interaction Model"
- Set the __Name__ to "New York Running Calendar"
- Set the __Invocation Name__ to "New York Running Calendar"

__Interaction Model__

- Intent Scheme: [speechAssets/IntentSchema.json](./speechAssets/IntentSchema.json)
- Sample Utterances: [speechAssets/SampleUtterances.txt](./speechAssets/SampleUtterances.txt)

__Configuration__

- Set the __Endpoint__ radio button to __Lambda ARN__
- Set the __Endpoint__ value to the ```FunctionArn``` returned by ```lambda_function_create.sh``` above
- Set __Account Linking__ to "No"

__Skill Publishing Information__

- _Short Skill Description_

    The New York Running Calendar app helps you find the next organized running race in New York City.

- _Full Skill Description_

    The New York Running Calendar helps you find the next organized running race in New York City.

    To get started say "Alexa, ask New York Running Calendar: When is the next race?"

    The app will then search the web for upcoming races and will tell you the name
    of the next race, where it is being held, and the date and time it starts.

- _Example Phrases_

    - Alexa, ask New York Running Calendar: When is the next race?
    - When's the next race?
    - What is the next race?

- _Keywords_

    New York, Running

- _Images_

    - [Small Icon](./images/nyrc-108.png)
    - [Large Icon](./images/nyrc-512.png)

- _Testing Instructions_

    No special instructions.  Just say "Alexa, ask New York Running Calendar: When is the next race?"


## References

- [New York Road Runners Race Calendar](http://www.nyrr.org/races-and-events/2016)
