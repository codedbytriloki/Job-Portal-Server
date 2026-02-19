import DataUriParser from "datauri/parser.js";
import path from "path";

const getDataUri = (file) => {
  // guard against missing file object to prevent undefined errors
  if (!file || !file.originalname || !file.buffer) {
    return null;
  }
  const parser = new DataUriParser();
  const extName = path.extname(file.originalname).toString();
  return parser.format(extName, file.buffer);
}

export default getDataUri;

