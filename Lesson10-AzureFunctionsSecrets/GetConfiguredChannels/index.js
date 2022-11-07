const airtable = require('airtable');
const {DefaultAzureCredential} = require('@azure/identity');
const {SecretClient} = require('@azure/keyvault-secrets');

//Class used to store data about a specific channel received from a data source
class ChannelConfig {
	Label;
	ChannelId;

	constructor(label, channelId){
		this.Label = label;
		this.ChannelId = channelId;
	}
}

module.exports = async function (context, req) {
    context.log('Loading configured channels from data store.');

    /*Check for environment variables and report back if any are missing. Configuration needs to be checked first to ensure the developer gets 
     to a working environment faster.
    */
     const keyVaultName = process.env["KEY_VAULT_NAME"];
     const apiKeySecretName = process.env["KEY_AIRTABLE_API"];
     const databaseIdSecretName = process.env["KEY_AIRTABLE_DATABASE_ID"];
     if(!keyVaultName || !apiKeySecretName || !databaseIdSecretName){
        var missingEnvironmentSettingMessage = "Environment settings have not been configured correctly."
        if(!keyVaultName){
            missingEnvironmentSettingMessage += "\n -KEY_VAULT_NAME : This environment variable has not been configured with a value. Please specify the name of your key vault to be used in the URL for the vault (e.g. https://${keyVaultName}.vault.azure.net.";
        }
        if(!apiKeySecretName){
            missingEnvironmentSettingMessage += "\n -KEY_AIRTABLE_API: This environment variable  has not been configured with a value. Please specify the name of the secret in the vault which contains the API Key used to connect to the Airtable API.";
        }
        if(!databaseIdSecretName){
            missingEnvironmentSettingMessage += "\n -KEY_AIRTABLE_DATABASE_ID: This environment variable  has not been configured with a value. Please specify the name of the secret in the vault which contains the API Key used to connect to the Airtable API.";
        }

        context.log(missingEnvironmentSettingMessage);
        context.res = {
            status: 500,
            body: missingEnvironmentSettingMessage,
        };
        return;
    } 

    //Get the API key and database ID from the key vault
    const keyVaultUri = `https://${keyVaultName}.vault.azure.net`;
    const credential = new DefaultAzureCredential();
    const secretClient = new SecretClient(keyVaultUri, credential);
    const apiKeySecret = await secretClient.getSecret(apiKeySecretName);
    const databaseIdSecret = await secretClient.getSecret(databaseIdSecretName);
    

    //Load the Airtable API and specify authentication and the base we want to connect to
    const apiKey = apiKeySecret.value;
    const databaseId = databaseIdSecret.value;
    airtable.configure({
        endpointUrl: 'https://api.airtable.com',
        apiKey: apiKey
    });
    var base = airtable.base(databaseId);

    //Select the list of records from the Airtable 
    var records = await base('Channels').select().all();
    context.log(`Airtable records: ${records}`)

    //Create the array of configured channels
    var channelConfigList = new Array();
    records.forEach(function(record){
        var channelConfig = new ChannelConfig(
            record.get('Label'), 
            record.get('ChannelId')
        );
        //Add to the list of channel configuration
        channelConfigList.push(channelConfig);
    })

    context.log(`Configured channels: ${channelConfigList}`);
    context.res = {
        body: channelConfigList
    };
}