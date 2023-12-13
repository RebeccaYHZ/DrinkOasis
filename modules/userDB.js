import "dotenv/config";

import { MongoClient } from "mongodb";
import { ObjectId } from "mongodb";

function UserDB() {
  const uri = process.env.MONGO_URL;
  const userDB = {};

  const connectToMongoDB = async () => {
    const client = new MongoClient(uri);
    await client.connect();
    const db = client.db("DrinkOasis");

    return { client, db };
  };

  userDB.getMax = async () => {
    const { client, db } = await connectToMongoDB();
    const usersCollection = db.collection("User");

    try {
      const result = await usersCollection
        .aggregate([{ $group: { _id: null, maxId: { $max: "$id" } } }])
        .toArray();

      if (result.length > 0) {
        const maxId = result[0].maxId;
        return maxId;
      }

      return 0;
    } catch (error) {
      console.error(error);
    } finally {
      await client.close();
    }
  };

  userDB.getNextDiaryId = async (id) => {
    const userId = parseInt(id, 10);
    const { client, db } = await connectToMongoDB();
    const usersCollection = db.collection("User");

    try {
      const user = await usersCollection.findOne({ id: userId });
      if (!user || !user.diaries || !Array.isArray(user.diaries)) {
        return 0;
      }

      return user.diaries.reduce(
        (max, diary) => (diary.id > max ? diary.id : max),
        0
      );
    } catch (error) {
      console.error(error);
    } finally {
      await client.close();
    }
  };

  userDB.insertUser = async (user) => {
    const { client, db } = await connectToMongoDB();
    const usersCollection = db.collection("User");

    try {
      const result = await usersCollection.insertOne(user);
      console.log("User inserted", result.insertedCount);
      return result;
    } finally {
      console.log("DB closing connection");
      await client.close();
    }
  };

  userDB.getUser = async (userName) => {
    const { client, db } = await connectToMongoDB();
    const usersCollection = db.collection("User");

    try {
      const user = await usersCollection.findOne(
        { username: userName },
        { projection: { salt: 1, hashed_password: 1 } }
      );
      console.log(user);

      if (!user) {
        console.log("User not found");
        return null;
      }
      const salt = Buffer.from(user.salt, "hex");

      return user;
    } finally {
      console.log("DB closing connection");
      await client.close();
    }
  };

  userDB.getUserById = async (id) => {
    const { client, db } = await connectToMongoDB();
    const usersCollection = db.collection("User");

    try {
      const user = await usersCollection.findOne({ _id: new ObjectId(id) });
      console.log("User found:", user);
      return user;
    } catch (error) {
      console.error("Error fetching user:", error);
      throw error;
    }
  };

  userDB.postDiary = async (id, newDiary) => {
    const userId = parseInt(id, 10);
    const { client, db } = await connectToMongoDB();
    const usersCollection = db.collection("User");

    try {
      const userSelect = await usersCollection.findOne({ id: userId });
      if (!userSelect) {
        return { status: 404, message: "User not found" };
      }
      let diariesCollection = userSelect.diaries;
      if (!Array.isArray(diariesCollection)) {
        diariesCollection = [];
      }

      diariesCollection.push(newDiary);

      const updateResult = await usersCollection.updateOne(
        { id: userId },
        { $set: { diaries: diariesCollection } }
      );

      if (updateResult.modifiedCount === 1) {
        return {
          status: 200,
          message: "Diary added successfully",
          diary: newDiary,
        };
      } else {
        return { status: 500, message: "Internal Server Error" };
      }
    } catch (error) {
      console.error(error);
      return { status: 500, message: "Internal Server Error" };
    } finally {
      client.close();
    }
  };

  userDB.getDiaries = async (id) => {
    const userId = parseInt(id, 10);
    const { client, db } = await connectToMongoDB();
    const usersCollection = db.collection("User");

    try {
      const userSelect = await usersCollection.findOne({ id: userId });
      if (!userSelect) {
        return { status: 404, message: "User not found" };
      }
      const diariesCollection = userSelect.diaries;
      // if (!Array.isArray(diariesCollection)) {
      //   return { status: 400, message: "Diaries collection is not an array" };
      // }
      if (!diariesCollection || diariesCollection.length === 0) {
        return { status: 200, diariesCollection: [] };
      }

      return { status: 200, diariesCollection };
    } catch (error) {
      console.error(error);
      return { status: 500, message: "Internal Server Error" };
    } finally {
      client.close();
    }
  };

  userDB.deleteDiary = async (id, diaryId) => {
    const userId = parseInt(id, 10);
    const { client, db } = await connectToMongoDB();
    const usersCollection = db.collection("User");

    try {
      const userSelect = await usersCollection.findOne({ id: userId });
      if (!userSelect) {
        return { status: 404, message: "User not found" };
      }

      const diariesCollection = userSelect.diaries;
      if (!Array.isArray(diariesCollection)) {
        return { status: 400, message: "Diaries collection is not an array" };
      }

      const diaryIndex = diariesCollection.findIndex(
        (diary) => diary.id === parseInt(diaryId)
      );

      if (diaryIndex === -1) {
        return { status: 404, message: "Diary not found" };
      }

      diariesCollection.splice(diaryIndex, 1);

      const updateResult = await usersCollection.updateOne(
        { id: userId },
        { $set: { diaries: diariesCollection } }
      );

      if (updateResult.modifiedCount === 1) {
        return { status: 200, message: "Diary deleted successfully" };
      } else {
        return { status: 500, message: "Internal Server Error" };
      }
    } catch (error) {
      console.error(error);
      return { status: 500, message: "Internal Server Error" };
    } finally {
      client.close();
    }
  };

  userDB.getDiary = async (id, diaryId) => {
    const { client, db } = await connectToMongoDB();
    const usersCollection = db.collection("User");
    console.log("User id for get Diary:", id);

    try {
      const userSelect = await usersCollection.findOne({
        id: id,
      });
      console.log("User select for get Diary:", userSelect);
      if (!userSelect) {
        return { status: 404, message: "User not found" };
      }

      const diariesCollection = userSelect.diaries;
      if (!Array.isArray(diariesCollection)) {
        return { status: 400, message: "Diaries collection is not an array" };
      }

      const diaryIndex = diariesCollection.findIndex(
        (diary) => diary.id === parseInt(diaryId)
      );

      if (diaryIndex === -1) {
        return { status: 404, message: "Diary not found" };
      }

      const diary = diariesCollection[diaryIndex];
      return { status: 200, diary };
    } catch (error) {
      console.error(error);
      return { status: 500, message: "Internal Server Error" };
    } finally {
      client.close();
    }
  };

  userDB.editDiary = async (id, diaryId, newDiary) => {
    // const userId = parseInt(id, 10);
    const { client, db } = await connectToMongoDB();
    const usersCollection = db.collection("User");

    try {
      const userSelect = await usersCollection.findOne({ id: id });
      if (!userSelect) {
        return { status: 404, message: "User not found" };
      }

      const diariesCollection = userSelect.diaries;
      if (!Array.isArray(diariesCollection)) {
        return { status: 400, message: "Diaries collection is not an array" };
      }

      const diaryIndex = diariesCollection.findIndex(
        (diary) => diary.id === parseInt(diaryId)
      );

      if (diaryIndex === -1) {
        return { status: 404, message: "Diary not found" };
      }

      diariesCollection[diaryIndex] = newDiary;

      const updateResult = await usersCollection.updateOne(
        { id: id },
        { $set: { diaries: diariesCollection } }
      );

      if (updateResult.modifiedCount === 1) {
        return { status: 200, message: "Diary edited successfully" };
      } else {
        return { status: 500, message: "Internal Server Error" };
      }
    } catch (error) {
      console.error(error);
      return { status: 500, message: "Internal Server Error" };
    } finally {
      client.close();
    }
  };

  return userDB;
}

export const userDB = UserDB();
