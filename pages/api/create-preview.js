// pages/api/create-preview.js
import { db } from '../../lib/firebaseAdmin';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { pdfUrl, extraData } = req.body;

  if (!pdfUrl) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Create a unique preview ID using UUID
  const id = uuidv4();

  const record = {
    id,
    pdfUrl,
    extraData: extraData || {},
    paymentStatus: 'pending',
    createdAt: new Date().toISOString()
  };

  try {
    await db.collection("previews").doc(id).set(record);
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Content-Type', 'application/json');
    console.log("Preview url:", `https://tax-tally.com/preview/${id}`);
    return res.status(200).send({
      response: {
        status: 200,
        message: "success",
        id,
        previewUrl: `https://tax-tally.com/preview/${id}`
      }
    });
  } catch (error) {
    console.error("Error saving preview:", error);
    res.status(500).json({ error: 'Error saving preview' });
  }
}