import {DynamoDBClient,GetItemCommand} from "@aws-sdk/client-dynamodb";
import { BatchWriteCommand,PutCommand, DynamoDBDocumentClient, UpdateCommand ,ScanCommand } from "@aws-sdk/lib-dynamodb";
import bcrypt from 'bcrypt';
import AWS from "aws-sdk"

const dynamodbClient=new DynamoDBClient({ region: 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(dynamodbClient);

const getItem=async()=>{
    const params = {
        TableName:'PocketCards',
        Key:{
            PK: { S:'COUNTER' },
            SK: { S: 'COUNTER' }  
        }
    }
    try {
        const data =await dynamodbClient.send(new GetItemCommand(params));
        console.log(data.Item);
    }catch(err){
        console.log(err);
    }
}

const addMultipleItem=async()=>{
    const timestamp=Date.now().toString();
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash('bonnie', saltRounds);
    const merchant_params = {
        RequestItems: {
          PocketCards: [{
              PutRequest: {
                Item: {
                  PK: "MERCHANT#1",
                  SK: "INFO",
                  LastUpdate: timestamp,
                  merchant_name: 'Utopia books & coffee',
                  address: '117 Swanston Street, Melbourne VIC 3000',
                  cover_image:"merchant-images/display/1.png",
                  logo_image:"merchant-images/logo/1.png"
                }
              }
            }, ]
        }
      };

      const promotion_params = {
        RequestItems: {
          PocketCards: [{
              PutRequest: {
                Item: {
                  PK: "MERCHANT#1",
                  SK: "PROM#1",
                  LastUpdate: timestamp,
                  promotion_name: "Buy 9 get 1 free",
                  status: "active",
                  rule: "Purchase 9 regular-priced coffees and receive 1 free. Excludes specialty drinks and discounts.",
                  goal_item: 9,
                  start_date: "1735694400",
                  end_date: "1767235200"
                }
              }
            },]
        }
      };

      const user_params = {
        RequestItems: {
          PocketCards: [{
              PutRequest: {
                Item: {
                  PK: "USER#1",
                  SK: "INFO",
                  LastUpdate: timestamp,
                  user_name: "bonnie",
                  password: hashedPassword,
                  
                }
              }
            },]
        }
      };

      const card_params = {
        RequestItems: {
          PocketCards: [{
              PutRequest: {
                Item: {
                  PK: "USER#1",
                  SK: "CARD#1",
                  GSI1PK:"MERCHANT#1",
                  GSI1SK:"PROM#1",
                  status:"ongoing",
                  LastUpdate: timestamp,
                  current_item:2,
                }
              }
            },{
                PutRequest: {
                  Item: {
                    PK: "USER#1",
                    SK: "CARD#2",
                    GSI1PK:"MERCHANT#1",
                    GSI1SK:"PROM#1",
                    status:"redeemed",
                    LastUpdate: timestamp,
                    current_item:5,
                  }
                }
              },{
                PutRequest: {
                  Item: {
                    PK: "USER#1",
                    SK: "CARD#3",
                    GSI1PK:"MERCHANT#1",
                    GSI1SK:"PROM#1",
                    status:"available",
                    LastUpdate: timestamp,
                    current_item:5,
                  }
                }
              },]
        }
      };



      try {
        const command = new BatchWriteCommand(card_params);
        const response = await docClient.send(command);
        console.log("Batch items added successfully:", response);
      } catch (error) {
        console.error("Error adding batch items:", error);
      }
}


  
  