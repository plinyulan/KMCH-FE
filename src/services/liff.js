import liff from "@line/liff";

export async function initLiff() {
  try {
    await liff.init({
      liffId: import.meta.env.VITE_LIFF_ID,
    });

    if (!liff.isLoggedIn()) {
      liff.login();
      return null;
    }

    return await liff.getProfile();
  } catch (err) {
    console.error(err);
    return null;
  }
}