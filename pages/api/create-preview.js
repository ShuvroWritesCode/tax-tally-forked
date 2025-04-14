// pages/api/create-preview.js
import { db } from '../../lib/firebaseAdmin';
import { v4 as uuidv4 } from 'uuid';

export default async function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight (CORS)
  if (req.method === 'OPTIONS') {
    return res.status(204).end(); // No Content
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { pdfUrl, extraData } = req.body;

    if (!pdfUrl) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const id = uuidv4();
    const record = {
      id,
      pdfUrl,
      extraData: extraData || {},
      paymentStatus: 'pending',
      createdAt: new Date().toISOString(),
    };

    await db.collection('previews').doc(id).set(record);

    return res.status(200).json({
      response: {
        status: 200,
        message: 'success',
        error: false,
        id,
        previewUrl: `https://tax-tally.com/preview/${id}`,
      },
    });
  } catch (error) {
    console.error('Error saving preview:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
