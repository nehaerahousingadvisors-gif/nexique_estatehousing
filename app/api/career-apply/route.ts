import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, phone, designation, experience, message, resumeName, resumeUrl } = body;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 24px; border-radius: 12px;">
        <div style="background: #1a2744; padding: 20px 24px; border-radius: 8px 8px 0 0; margin-bottom: 0;">
          <h2 style="color: #C4A35A; margin: 0; font-size: 20px;">New Job Application</h2>
          <p style="color: #94a3b8; margin: 4px 0 0; font-size: 13px;">Nexique Estate — Career Form</p>
        </div>
        <div style="background: white; padding: 24px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0;">
          <table style="width: 100%; border-collapse: collapse;">
            ${[
              ['Full Name',    `${firstName} ${lastName}`],
              ['Email',        email],
              ['Phone',        phone],
              ['Designation',  designation || '—'],
              ['Experience',   experience  || '—'],
              ['Resume',       resumeUrl ? `<a href="${resumeUrl}" style="color:#1a2744;">${resumeName || 'Download Resume'}</a>` : (resumeName || '—')],
              ['Message',      message     || '—'],
            ].map(([label, value], i) => `
              <tr style="background: ${i % 2 === 0 ? '#f8fafc' : 'white'};">
                <td style="padding: 10px 14px; font-weight: 700; color: #475569; font-size: 13px; width: 160px; border-bottom: 1px solid #f1f5f9;">${label}</td>
                <td style="padding: 10px 14px; color: #1e293b; font-size: 13px; border-bottom: 1px solid #f1f5f9;">${value}</td>
              </tr>
            `).join('')}
          </table>
          <p style="margin: 20px 0 0; font-size: 12px; color: #94a3b8;">
            Submitted on ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST
          </p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from:    `"Nexique Estate Careers" <${process.env.GMAIL_USER}>`,
      to:      'info@nexiqueestate.com',
      replyTo: email,
      subject: `New Application: ${designation || 'Job Application'} — ${firstName} ${lastName}`,
      html,
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error('Career email error:', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
