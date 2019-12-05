const AWS = require('aws-sdk');

const ses = new AWS.SES({
	region: 'eu-central-1'
});

const createTemplate = (event, context, callback) => {
	
	const { templateName, subject, body } = event.body

	var params = {
		Template: { 
			TemplateName: templateName, 
			HtmlPart: body,
			SubjectPart: subject      
		}
	}
  
	ses.createTemplate(params, (err, data) => {
		if (err) {
			callback(null, {
				statusCode: '500',
				body: JSON.stringify(err)
			});
		} else {
			callback(null, {
				statusCode: '200',
				body: JSON.stringify('OK')
			});
	  }
	})
}

const sendEmail = (event, context, callback) => {
	
	// sqs or http event ... maby it will be better split into two lambdas
	let body = '';
	if (event.body) {
		body = event.body;
	} else {
		body = event.Records[0].body;
	}
	
	const { templateName, sendTo, data } = JSON.parse(body);

	const params = {
		Template: templateName,
		Destination: { 
			ToAddresses: [
				sendTo
			]
		},
		Source: '',
		TemplateData: JSON.stringify(data || {})
	};

	ses.sendTemplatedEmail(params, (err, data) => {
		if (err) {
			callback(null, {
				statusCode: '500',
				body: JSON.stringify(err)
			});
		} else{
			callback(null, {
				statusCode: '200',
				body: JSON.stringify('OK')
			});
		}
	});
}

exports.send = sendEmail;
exports.template = createTemplate;