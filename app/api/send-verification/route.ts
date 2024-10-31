import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

// Specify that this route uses the Edge Runtime
export const runtime = 'edge';

const resend = new Resend(process.env.RESEND_VERIFY_API_KEY);

export async function POST(request: NextRequest) {
  try {
    console.log('Received request');
    
    // Get the form data using the native Web API
    const formData = await request.formData();
    console.log('FormData received');

    // Get the files from the form data
    const selfieFile = formData.get('selfie') as File;
    const idFile = formData.get('idImage') as File;
    const userId = formData.get('userId') as string;
    const username = formData.get('username') as string;

    console.log('Files extracted:', {
      selfie: selfieFile?.name,
      id: idFile?.name
    });

    if (!selfieFile || !idFile) {
      return NextResponse.json({ 
        message: 'File(s) missing' 
      }, { 
        status: 400 
      });
    }

    // Convert files to ArrayBuffer
    const selfieBuffer = await selfieFile.arrayBuffer();
    const idBuffer = await idFile.arrayBuffer();

    // Convert ArrayBuffer to Base64
    const selfieBase64 = Buffer.from(selfieBuffer).toString('base64');
    const idBase64 = Buffer.from(idBuffer).toString('base64');

    try {
      const { data, error: emailError } = await resend.emails.send({
        from: 'Acme <noreply@semesterbyte.se>',
        to: ['hoomies.verify@gmail.com'],
        subject: 'User Verification Request',
        text: `Please verify ${userId} (${username}) with the following images`,
        attachments: [
          {
            filename: selfieFile.name,
            content: selfieBase64
          },
          {
            filename: idFile.name,
            content: idBase64
          }
        ],
      });

      console.log('Email response:', { data, error: emailError });

      if (emailError) {
        console.error('Email error:', emailError);
        return NextResponse.json(
          { message: 'Error sending email', error: emailError },
          { status: 500 }
        );
      }

      return NextResponse.json({ 
        message: 'Email sent successfully' 
      }, { 
        status: 200 
      });
    } catch (error: any) {
      console.error('Email sending error:', error);
      return NextResponse.json(
        { message: 'Error sending email', error: error.message },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error('Processing error:', error);
    return NextResponse.json(
      { message: 'Error processing request', error: error.message },
      { status: 500 }
    );
  }
}