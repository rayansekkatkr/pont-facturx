"""
Service d'envoi d'emails avec Resend
"""
import random
import secrets
from datetime import datetime, timedelta

import resend
from jose import jwt

from app.config import settings


# Initialiser Resend avec la clé API
if settings.resend_api_key:
    resend.api_key = settings.resend_api_key


def generate_verification_code() -> str:
    """Générer un code de vérification à 6 chiffres"""
    return str(random.randint(100000, 999999))


def create_verification_token(email: str, expires_hours: int = 24) -> str:
    """Créer un token de vérification JWT"""
    expire = datetime.utcnow() + timedelta(hours=expires_hours)
    data = {
        "email": email,
        "exp": expire,
        "type": "email_verification",
    }
    return jwt.encode(data, settings.jwt_secret, algorithm=settings.jwt_algorithm)


def verify_verification_token(token: str) -> str | None:
    """Vérifier un token de vérification et retourner l'email"""
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
        if payload.get("type") != "email_verification":
            return None
        return payload.get("email")
    except Exception:
        return None


def send_verification_email(email: str, first_name: str, verification_url: str) -> bool:
    """
    Envoyer un email de vérification de compte

    Args:
        email: L'adresse email du destinataire
        first_name: Le prénom de l'utilisateur
        verification_url: L'URL de vérification (avec token)

    Returns:
        True si l'email a été envoyé avec succès
    """
    if not settings.resend_api_key:
        print("⚠️ RESEND_API_KEY non configuré - Email non envoyé")
        return False

    html_content = f"""
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vérifiez votre email</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%); border-radius: 16px 16px 0 0;">
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                                Factur-X <span style="font-weight: 400;">Convert</span>
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="margin: 0 0 16px; color: #0f172a; font-size: 24px; font-weight: 600;">
                                Bienvenue {first_name} ! 👋
                            </h2>
                            <p style="margin: 0 0 24px; color: #475569; font-size: 16px; line-height: 1.6;">
                                Merci de vous être inscrit sur <strong>Factur-X Convert</strong>. Pour activer votre compte et commencer à convertir vos factures, veuillez vérifier votre adresse email.
                            </p>
                            
                            <!-- CTA Button -->
                            <table role="presentation" style="width: 100%;">
                                <tr>
                                    <td style="text-align: center; padding: 24px 0;">
                                        <a href="{verification_url}" 
                                           style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 2px 4px rgba(14, 165, 233, 0.3);">
                                            ✉️ Vérifier mon email
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 24px 0 0; color: #64748b; font-size: 14px; line-height: 1.6;">
                                Si le bouton ne fonctionne pas, copiez et collez ce lien dans votre navigateur :
                            </p>
                            <p style="margin: 8px 0 0; color: #0EA5E9; font-size: 13px; word-break: break-all;">
                                {verification_url}
                            </p>
                            
                            <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
                                <p style="margin: 0 0 8px; color: #475569; font-size: 14px;">
                                    <strong>Ce lien est valide pendant 24 heures.</strong>
                                </p>
                                <p style="margin: 0; color: #64748b; font-size: 13px;">
                                    Si vous n'avez pas créé de compte, vous pouvez ignorer cet email en toute sécurité.
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 32px 40px; background-color: #f8fafc; border-radius: 0 0 16px 16px; text-align: center;">
                            <p style="margin: 0 0 8px; color: #64748b; font-size: 13px;">
                                © 2026 Factur-X Convert. Tous droits réservés.
                            </p>
                            <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                                8 allée du pré • 06 36 36 56 96
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
"""

    try:
        params = {
            "from": settings.email_from,
            "to": [email],
            "subject": "Vérifiez votre email - Factur-X Convert",
            "html": html_content,
        }
        resend.Emails.send(params)
        print(f"✅ Email de vérification envoyé à {email}")
        return True
    except Exception as e:
        print(f"❌ Erreur lors de l'envoi de l'email à {email}: {e}")
        return False


def send_purchase_confirmation_email(
    email: str,
    first_name: str,
    purchase_type: str,  # "pack" ou "subscription"
    item_name: str,  # "Pack 20 crédits", "Pro", etc.
    amount: float,
    credits: int | None = None,
) -> bool:
    """
    Envoyer un email de confirmation d'achat

    Args:
        email: L'adresse email du destinataire
        first_name: Le prénom de l'utilisateur
        purchase_type: "pack" ou "subscription"
        item_name: Nom de l'offre achetée
        amount: Montant payé en euros
        credits: Nombre de crédits (pour les packs) ou None

    Returns:
        True si l'email a été envoyé avec succès
    """
    if not settings.resend_api_key:
        print("⚠️ RESEND_API_KEY non configuré - Email non envoyé")
        return False

    # Déterminer le contenu selon le type
    if purchase_type == "pack":
        item_description = f"<strong>{credits} crédits</strong> de conversion"
        usage_info = "Vos crédits sont disponibles immédiatement et n'expirent jamais."
    else:  # subscription
        item_description = f"Abonnement <strong>{item_name}</strong>"
        usage_info = "Votre quota mensuel a été rechargé et est renouvelé automatiquement chaque mois."

    html_content = f"""
<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Confirmation d'achat</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f8fafc;">
    <table role="presentation" style="width: 100%; border-collapse: collapse;">
        <tr>
            <td style="padding: 40px 20px;">
                <table role="presentation" style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                    <!-- Header -->
                    <tr>
                        <td style="padding: 40px 40px 20px; text-align: center; background: linear-gradient(135deg, #10B981 0%, #059669 100%); border-radius: 16px 16px 0 0;">
                            <div style="width: 64px; height: 64px; margin: 0 auto 16px; background-color: rgba(255, 255, 255, 0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px;">
                                ✓
                            </div>
                            <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                                Factur-X <span style="font-weight: 400;">Convert</span>
                            </h1>
                        </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                        <td style="padding: 40px;">
                            <h2 style="margin: 0 0 16px; color: #0f172a; font-size: 24px; font-weight: 600;">
                                Merci pour votre achat ! 🎉
                            </h2>
                            <p style="margin: 0 0 24px; color: #475569; font-size: 16px; line-height: 1.6;">
                                Bonjour {first_name}, votre paiement a été traité avec succès.
                            </p>
                            
                            <!-- Purchase Details -->
                            <div style="background-color: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                                <h3 style="margin: 0 0 16px; color: #0f172a; font-size: 18px; font-weight: 600;">
                                    Détails de votre achat
                                </h3>
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Article</td>
                                        <td style="padding: 8px 0; color: #0f172a; font-size: 14px; text-align: right; font-weight: 600;">
                                            {item_description}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td style="padding: 8px 0; color: #64748b; font-size: 14px;">Montant</td>
                                        <td style="padding: 8px 0; color: #0f172a; font-size: 14px; text-align: right; font-weight: 600;">
                                            {amount:.2f} €
                                        </td>
                                    </tr>
                                    <tr style="border-top: 1px solid #e2e8f0;">
                                        <td style="padding: 16px 0 8px; color: #0f172a; font-size: 16px; font-weight: 600;">Total TTC</td>
                                        <td style="padding: 16px 0 8px; color: #10B981; font-size: 20px; text-align: right; font-weight: 700;">
                                            {amount:.2f} €
                                        </td>
                                    </tr>
                                </table>
                            </div>
                            
                            <div style="background: linear-gradient(135deg, #EFF6FF 0%, #DBEAFE 100%); border-left: 4px solid #0EA5E9; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                                <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.6;">
                                    <strong>✨ C'est prêt !</strong><br>
                                    {usage_info}
                                </p>
                            </div>
                            
                            <!-- CTA Button -->
                            <table role="presentation" style="width: 100%;">
                                <tr>
                                    <td style="text-align: center; padding: 8px 0;">
                                        <a href="{settings.webapp_url}/dashboard" 
                                           style="display: inline-block; padding: 16px 32px; background: linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%); color: #ffffff; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 2px 4px rgba(14, 165, 233, 0.3);">
                                            🚀 Accéder à mon compte
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            
                            <div style="margin-top: 32px; padding-top: 24px; border-top: 1px solid #e2e8f0;">
                                <p style="margin: 0 0 8px; color: #475569; font-size: 14px;">
                                    <strong>Questions ?</strong>
                                </p>
                                <p style="margin: 0; color: #64748b; font-size: 13px; line-height: 1.6;">
                                    Notre équipe support est à votre disposition : 
                                    <a href="mailto:contact@pont-facturx.com" style="color: #0EA5E9; text-decoration: none;">contact@pont-facturx.com</a>
                                </p>
                            </div>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 32px 40px; background-color: #f8fafc; border-radius: 0 0 16px 16px; text-align: center;">
                            <p style="margin: 0 0 8px; color: #64748b; font-size: 13px;">
                                © 2026 Factur-X Convert. Tous droits réservés.
                            </p>
                            <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                                8 allée du pré • 06 36 36 56 96
                            </p>
                            <p style="margin: 8px 0 0; font-size: 12px;">
                                <a href="{settings.webapp_url}/legal/privacy" style="color: #94a3b8; text-decoration: none;">Confidentialité</a> • 
                                <a href="{settings.webapp_url}/legal/terms" style="color: #94a3b8; text-decoration: none;">CGU</a>
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
"""

    try:
        params = {
            "from": settings.email_from,
            "to": [email],
            "subject": f"Confirmation d'achat - {item_name}",
            "html": html_content,
        }
        resend.Emails.send(params)
        print(f"✅ Email de confirmation d'achat envoyé à {email}")
        return True
    except Exception as e:
        print(f"❌ Erreur lors de l'envoi de l'email à {email}: {e}")
        return False
