const sendgrid = require('@sendgrid/mail')
const data = require('./index')
sendgrid.setApiKey(process.env.SENDGRID_API_KEY)
const R = require('ramda')
const fs = require('fs');

const x = data.map(obj => {
  const name = obj.name
  const activities = obj.act_id.map(id => `<li><a href="https://aidstream.org/activity/${id}">https://aidstream.org/activity/${id}</a></li>`).join('')

  return obj.email.map(email => {
    return {
      to: email,
      from: 'support@aidstream.org',
      subject: "Need republishing - Some of your published activities use IATI Standard V1 in the XML",
      text: "Need republishing - Some of your published activities use IATI Standard V1 in the XML",
      html: `<p>Dear ${name},</p>

        <p>Greetings from AidStream.<p>

        <p>We analyzed your published data in IATI Registry and found that the following activities are still using deprecated IATI Standard V1 in the XML file.</p>

        ${activities}

        <p>These might have caused during system upgrade in 2016. You may correct these issues by following the steps below.</p>

        <strong>What do you need to do?</strong>
        <ul>
            <li> Login to AidStream</li>
            <li> Go to each activity link above</li>
            <li> Republish the activity one by one to publish to IATI V2.</li>
        </ul>

        <p>Let us know if you have any questions or confusions.</p>

        <p>Please note that we also provide premium support services to fix these issues. Let us know if you are interested in premium support for the fixing aforementioned data issues. https://aidstream.org/premium </p>

        <p>Best regards,</p>

        <p>AidStream Team</p>`
    }
  })
})


const msg = R.unnest(x)

msg.map(message => {
  (async () => {
    try {
      await sendgrid.send(message);
      fs.appendFile('file.txt', `success : ${message.to}\n`, err => {
        if (err) throw err;
        console.log('written to file');
      })
    } catch (err) {
      console.error(err.toString());
    }
  })();
})