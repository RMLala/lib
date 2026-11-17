// AppForge V3: integration contract for the existing Liberté unlock screen.
// This file does not replace the application's UI or its stored PIN.
// Use from the existing unlock controller once the real UI source is available.
export async function unlockBiometricFirst({device,language='fr',verifyPin,onUnlocked,onFallback}) {
  if (!device || typeof verifyPin !== 'function' || typeof onUnlocked !== 'function') {
    throw new Error('Contrat de déverrouillage incomplet.');
  }
  let available=false;
  try {
    const result=await device.biometricAvailability();
    available=result?.available===true;
  } catch { available=false; }
  if (available) {
    try {
      await device.authenticateBiometric({language});
      await onUnlocked('biometric');
      return {unlocked:true,method:'biometric'};
    } catch {
      // Cancellation, hardware failure and lockout must not bypass the PIN.
    }
  }
  if (typeof onFallback==='function') await onFallback();
  return {unlocked:false,method:'pin',verifyPin};
}
export function appforgeSupportDetails({version,licenseStatus,cloudStatus}={}) {
  return {
    name:'Liberté',studio:'AppForge Studio',origin:'Made in Madagascar',
    supportEmail:'lalainaadclick@gmail.com',
    version:version||'Non renseignée',
    licenseStatus:licenseStatus||'Statut non disponible',
    cloudStatus:cloudStatus||'Statut non disponible'
  };
}
