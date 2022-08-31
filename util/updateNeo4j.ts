import { queryRunner } from "../controllers/user.controller";
import { User as UserNeo4J } from "../entity/UserNeoModel";
import {
  User,
  Tweet,
  Timeline,
  Retweet,
  Like,
  Comment,
  Bookmark,
  Room,
  Message,
  Session,
} from "../entity";
import { DataSource } from "typeorm";

async function updateNeo4jUser(_neo4j_email: string): Promise<void> {
  const appDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "compaq7550",
    database: "ensaTweet",
    entities: [
      User,
      Tweet,
      Like,
      Comment,
      Retweet,
      Session,
      Timeline,
      Bookmark,
      Room,
      Message,
    ],
  });
  await appDataSource.initialize();
  const result = await queryRunner.run(
    `Match (n:User) WHERE n.email="hamza@bouqal.com" return n`
  );

  const userRecord = result.records[0]?.get("n");
  if (!userRecord) throw new Error("user not found!");
  const userInstance = UserNeo4J.buildFromRecord(userRecord);

  const user = await appDataSource.manager.findOneBy(User, {
    email: "hamza@bouqal.com",
  });
  if (!user) throw new Error("user not found");
  console.log(userInstance, user);
  userInstance.userAvatar = user.userAvatar;
  await userInstance.save();
}

console.log("Searching for the User ...");
(async () => await updateNeo4jUser("332"))();
console.log("DONE ");
