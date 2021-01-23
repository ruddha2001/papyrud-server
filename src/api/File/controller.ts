import database from '../../loaders/database';
import LoggerInstance from '../../loaders/logger';
import { uploadFileToS3 } from '../Shared/Services/s3Service';

export const uploadFileController = async (
  email: string,
  title: string,
  filename: string,
  buffer: Buffer,
  mimeType: string,
  size: number,
) => {
  try {
    const uniquekey = await uploadFileToS3(filename, buffer, mimeType);
    let { storageObject } = await (await database()).collection('userdata').findOne({ email: email });
    if (storageObject === undefined) storageObject = {};
    storageObject[title] = uniquekey;
    if (Object.keys(storageObject).length === 1)
      await (await database()).collection('userdata').insertOne({ email: email, storageObject: storageObject });
    else
      await (await database())
        .collection('userdata')
        .updateOne({ email: email }, { $set: { storageObject: storageObject } });
  } catch (error) {
    LoggerInstance.error(error);
    throw error;
  }
};
