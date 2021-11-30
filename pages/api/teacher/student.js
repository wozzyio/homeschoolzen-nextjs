// import { verifyIdToken } from "../../../firebase/adminClient";
// // Fake users data
// const users = [{ id: 1 }, { id: 2 }, { id: 3 }]

// export default function handler(req, res) {
//     // Get data from your database
//     res.status(200).json(users)
// }

import { auth } from '../../../firebase/auth';

export default async (req, res) => {
  if (!req.headers.token) {
    return res.status(401).json({ error: 'Please include id token' });
  }

  try {
    const { uid } = await auth.verifyIdToken(req.headers.token);
    req.uid = uid;
  } catch (error) {
    return res.status(401).json({ error: error.message });
  }

  // more authorization checks based on uid 
  // business logic
}
