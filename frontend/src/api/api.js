export const domain = "http://localhost:8000";

export async function listImages() {
  try {
    const res = await fetch(`${domain}/images`);
    return res.json();
  } catch (e) {
    console.error("listImages call failed", e.toString());
    return null;
  }
}

export async function listPins(image) {
  try {
    // FIXME: sanitize image name
    const res = await fetch(`${domain}/images/${image}/points`);
    return res.json();
  } catch (e) {
    console.error("listPins call failed", e.toString());
    return null;
  }
}

export async function addPin(image, pin) {
  try {
    // FIXME: sanitize image name
    const res = await fetch(`${domain}/images/${image}/points`, {
      method: "POST",
      body: JSON.stringify(pin),
      headers: { "content-type": "application/json" },
    });
    return res.json();
  } catch (e) {
    console.error("addPin call failed", e.toString());
    return null;
  }
}

export async function deletePin(image, id) {
  try {
    // FIXME: sanitize image name
    const res = await fetch(`${domain}/images/${image}/points/${id}`, {
      method: "DELETE",
    });
    return res.json();
  } catch (e) {
    console.error("deletePin call failed", e.toString());
    return null;
  }
}
