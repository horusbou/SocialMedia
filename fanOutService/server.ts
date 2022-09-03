import express from "express"
import router from "./routes"
import { User as UserNeo4J } from "../entity/UserNeoModel";


const app = express();


app.use(router);

(async () => {
  console.log('heey')
  //users who follow me 
  const relationship = await UserNeo4J.findRelationships({
    alias: 'Follows',
    where: {
      target: { user_id: '5fbfbd22-8517-49c2-87be-64d680bd8f8e' }
    },
  });

  const followersId = relationship.map((follow: any) => {
    return follow.source.dataValues.user_id;
  });
  console.log(followersId)

})()
app.listen(8001, () => console.log('Fan Out Service is Running! '))
