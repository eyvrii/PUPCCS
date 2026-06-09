import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const { email, full_name, preferred_date, preferred_time, concern_type } = await req.json()

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'PUP Clinic <onboarding@resend.dev>',
      to: [email, 'averytubasco08@gmail.com'],
      subject: '✅ Your Appointment has been Approved - PUP Clinic',
      html: `
        <div style="font-family:sans-serif;max-width:500px;margin:auto;padding:24px;border:1px solid #eee;border-radius:12px">
          <div style="background:#800000;padding:20px;border-radius:8px 8px 0 0;text-align:center">
            <h2 style="color:#FFD700;margin:0">PUPCare Clinic</h2>
            <p style="color:white;margin:4px 0 0;font-size:12px">Polytechnic University of the Philippines</p>
          </div>
          <div style="padding:24px">
            <h3 style="color:#800000">Appointment Approved! ✅</h3>
            <p>Hi <strong>${full_name}</strong>,</p>
            <p>Your appointment has been <strong style="color:green">approved</strong>!</p>
            <table style="width:100%;border-collapse:collapse;margin:16px 0">
              <tr><td style="padding:10px;background:#f9f9f9;border:1px solid #eee"><strong>Date</strong></td><td style="padding:10px;border:1px solid #eee">${preferred_date}</td></tr>
              <tr><td style="padding:10px;background:#f9f9f9;border:1px solid #eee"><strong>Time</strong></td><td style="padding:10px;border:1px solid #eee">${preferred_time}</td></tr>
              <tr><td style="padding:10px;background:#f9f9f9;border:1px solid #eee"><strong>Concern</strong></td><td style="padding:10px;border:1px solid #eee;text-transform:capitalize">${concern_type?.replace(/_/g, ' ')}</td></tr>
            </table>
            <p style="background:#fff3cd;padding:12px;border-radius:8px;font-size:13px">⏰ Please arrive <strong>10 minutes</strong> before your scheduled time.</p>
            <p style="color:#888;font-size:12px;margin-top:24px">This is an automated message from PUP Clinic. Please do not reply.</p>
          </div>
        </div>
      `
    })
  })

  const data = await res.json()
  console.log('Resend response:', JSON.stringify(data))

  return new Response(JSON.stringify({ success: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
})