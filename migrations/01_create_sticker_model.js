module.exports = async (client) => {
  console.log("🛰️  Započinjem kreiranje modela...");

  // 1. Pravimo glavni model za Stikere (Popravljeno: api_key umesto apiKey)
  const stickerModel = await client.itemTypes.create({
    name: "Sticker",
    api_key: "sticker",
    modular_block: false,
  });

  // 2. Dodajemo polja jedno po jedno (Popravljeno: api_key umesto apiKey)
  await client.fields.create(stickerModel.id, {
    label: "Name",
    api_key: "name",
    field_type: "string",
    validators: { required: {} },
  });

  await client.fields.create(stickerModel.id, {
    label: "Slug",
    api_key: "slug",
    field_type: "slug",
    validators: { required: {} },
  });

  await client.fields.create(stickerModel.id, {
    label: "Tagline",
    api_key: "tagline",
    field_type: "string",
  });

  await client.fields.create(stickerModel.id, {
    label: "Description",
    api_key: "description",
    field_type: "text",
  });

  await client.fields.create(stickerModel.id, {
    label: "Kit",
    api_key: "kit",
    field_type: "string",
    hint: "Dozvoljene vrednosti: ai-portals, utility-hooks, media-pranks",
  });

  await client.fields.create(stickerModel.id, {
    label: "Role",
    api_key: "role",
    field_type: "string",
    hint: "Upiši 'network_scanner' za Tavily integraciju",
  });

  await client.fields.create(stickerModel.id, {
    label: "Webhook URL",
    api_key: "webhook_url", // Usklađeno sa API standardom
    field_type: "string",
  });

  await client.fields.create(stickerModel.id, {
    label: "Accent Color",
    api_key: "accent_color", // Usklađeno sa API standardom
    field_type: "color",
  });

  await client.fields.create(stickerModel.id, {
    label: "Preview Image",
    api_key: "preview_image", // Usklađeno sa API standardom
    field_type: "file",
  });

  await client.fields.create(stickerModel.id, {
    label: "Print Asset",
    api_key: "print_asset", // Usklađeno sa API standardom
    field_type: "file",
  });

  console.log("⚡ [DATOCMS CLI]: Model i sva polja su uspešno kreirani!");
};

