import multer from "multer";
import upload from "./Upload";


export const multerMiddleware = (upload: multer.Multer) => {
  return (req: any) =>
    new Promise<void>((resolve, reject) => {
      upload.single("profileImage")(req, {} as any, (err: any) => {
        if (err) reject(err);
        else resolve();
      });
    });
};


