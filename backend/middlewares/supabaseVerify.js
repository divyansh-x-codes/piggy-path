const { createClient } = require('@supabase/supabase-js');
const { prisma } = require('../prisma/client');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

/**
 * Middleware: Verifies Supabase JWT from Authorization header
 * Attaches req.user = { supabaseUid, email, dbUser }
 */
const verifySupabaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid Authorization header. Expected: Bearer <token>' });
    }

    const token = authHeader.split('Bearer ')[1];

    // Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      console.error('[Auth] Supabase token verification failed:', error?.message);
      return res.status(401).json({ error: 'Invalid or expired Supabase token' });
    }

    const { id: uid, email } = user;

    // Find or create user in our DB
    let dbUser = await prisma.user.findUnique({ where: { supabaseUid: uid } });

    if (!dbUser) {
      // New user — create record in the public.profiles table logic
      const displayName = user.user_metadata?.full_name || (email ? email.split('@')[0] : 'Trader');
      dbUser = await prisma.user.create({
        data: {
          supabaseUid: uid,
          email: email || null,
          name: displayName,
          balance: 100000,
        },
      });
      console.log(`[Auth] New Supabase user created: ${dbUser.name} (${dbUser.id})`);
    }

    // Attach to request
    req.user = {
      supabaseUid: uid,
      email,
      dbUser,
    };

    next();
  } catch (err) {
    console.error('[Auth] Unexpected error in verifySupabaseToken:', err);
    res.status(500).json({ error: 'Internal auth error' });
  }
};

module.exports = { verifySupabaseToken };
