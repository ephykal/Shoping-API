// import mongoose from "mongoose";
// import { Request, Response, NextFunction } from "express";
// import { Logger } from "../library/Logger";

// const validateObjectId = (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const { id, customerId, userId } = req.params;
//     if (id && !mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).send("Invalid ID");
//     }

//     if (customerId && !mongoose.Types.ObjectId.isValid(customerId)) {
//       return res.status(400).send("Invalid customer Id");
//     }

//     if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).send("Invalid user Id");
//     }
//     next();
//   } catch (error) {
//     Logger.error((error as Error).message, error);
//     res
//       .status(500)
//       .json({
//         errMessage: (error as Error).message,
//         message: "An error occured, id not found",
//       });
//     next(error);
//   }
// };

// export default validateObjectId;

import mongoose from "mongoose";
import { Request, Response, NextFunction } from "express";

const validateObjectId = (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id, customerId, userId } = req.params;

    if (id && !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).send("Invalid ID");
    }

    if (customerId && !mongoose.Types.ObjectId.isValid(customerId)) {
      return res.status(400).send("Invalid customer ID");
    }

    if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).send("Invalid user ID");
    }

    next();
  } catch (error) {
    next(error); // Pass error to the default error handler
  }
};

export default validateObjectId;
