# Serverless framework: sending emails example

## install

You have to set amazon account in aws credentinal in `~/.aws/credentials` and on the account have to be set a lot of permissions (s3, cloudformation, lambda, cloudwatch, events, apigateway, logs, ses, sqs). 

```sh 
npm i
npx sls deploy
```

## Create template:

```sh 
curl -X POST {YOUR API GW}/template -H "Content-Type: application/json" -d '{"templateName":"myapp_test", "subject":"Hello", "body": "Hello" }'

curl -X POST {YOUR API GW}/template -H "Content-Type: application/json" -d '{"templateName":"myapp_test1", "subject":"Hello {{short_name}}", "body": "<h1>Hello {{full_name}}</h1>" }'
```

## Send mail via API GW:

```sh
curl -X POST {YOUR API GW}/send -H "Content-Type: application/json" -d '{"templateName":"myapp_test", "sendTo": "tom@mydomain.com"}'

curl -X POST {YOUR API GW}/send -H "Content-Type: application/json" -d '{"templateName":"myapp_test1", "sendTo": "tom@mydomain.com", "data": {"short_name": "Tom", "full_name": "Tomas Pesek"} }'
```

## Send mail via SQS

### JS
```js
// Load the AWS SDK for Node.js
var AWS = require('aws-sdk');
// Set the region 
AWS.config.update({region: 'REGION'});
// Create an SQS service object
var sqs = new AWS.SQS({apiVersion: '2012-11-05'});
```

```js
sqs.sendMessage(
	{
	MessageBody: '{"templateName":"myapp_test", "sendTo": "tom@mydomain.com"}',
		QueueUrl: 'queueUrl'
	}, 
	function(err, data) {
		if (err) {
			console.log(err, err.stack);
		} else {
			console.log(data);
		}
	}
);
```

```js
sqs.sendMessage(
	{
		MessageBody: '{"templateName":"myapp_test1", "sendTo": "tom@mydomain.com", "data": {"short_name": "Tom", "full_name": "Tomas Pesek"} }',
		QueueUrl: 'queueUrl'
	}, 
	function(err, data) {
		if (err) {
			console.log(err, err.stack);
		} else {
			console.log(data);
		}
	}
);
```


### PHP

```php
use Aws\Common\Aws;

// Create a service builder using a configuration file
$aws = Aws::factory('/path/to/my_config.json');

// Get the client from the builder by namespace
$client = $aws->get('Sqs');
```


```php
$client->sendMessage(array(
	'MessageBody' => '{"templateName":"myapp_test", "sendTo": "tom@mydomain.com"}',
	'QueueUrl'    => $queueUrl,
));
```

```php
$client->sendMessage(array(
	'MessageBody' => '{"templateName":"myapp_test1", "sendTo": "tom@mydomain.com", "data": {"short_name": "Tom", "full_name": "Tomas Pesek"} }',
	'QueueUrl'    => $queueUrl,
));
```
