(function () {
    const LOREM_PARTS = [
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        "Praesent mauris. Fusce nec tellus sed augue semper porta. Praesent mauris. Fusce nec tellus sed augue semper porta.",
        "Class aptent taciti sociosqu ad litora torquent per conubia. Praesent mauris. ",
        "Integer nec odio. Praesent libero. Sed cursus ante dapibus.",
        "Duis sagittis ipsum.  "
    ];

    function loremMix() {
        const pick = () => LOREM_PARTS[Math.floor(Math.random() * LOREM_PARTS.length)];
        return `${pick()} ${pick()}`;
    }

    const tableData = [
        { attributtyp: "Attribut", name: "Description", id: "ATT-00068", type: "Text", publish: true, infotext: loremMix(), kommentar: loremMix(), sammlung: "VS", anzahl_objekte: 4588, created_by: "Admin", created_at: "2023-01-15", updated_by: "Editor", updated_at: "2024-03-20" },
        { attributtyp: "Attribut", name: "Height", id: "ATT-00065", type: "Metric (4)", publish: true, infotext: loremMix(), kommentar: loremMix(), sammlung: "VS", anzahl_objekte: 3201, created_by: "System", created_at: "2022-11-10", updated_by: "Admin", updated_at: "2024-02-14" },
        { attributtyp: "Attribut", name: "Diameter", id: "ATT-00077", type: "Metric (0)", publish: false, infotext: loremMix(), kommentar: loremMix(), sammlung: "VS", anzahl_objekte: 1542, created_by: "Editor", created_at: "2023-05-22", updated_by: "Editor", updated_at: "2024-01-08" },
        { attributtyp: "Attribut", name: "DNA comment", id: "ATT-00004", type: "Textarea", publish: true, infotext: loremMix(), kommentar: loremMix(), sammlung: "VS", anzahl_objekte: 892, created_by: "Admin", created_at: "2023-02-18", updated_by: "System", updated_at: "2024-03-15" },
        { attributtyp: "Attribut", name: "DNA extraction", id: "ATT-00005", type: "Text", publish: false, infotext: loremMix(), kommentar: loremMix(), sammlung: "VS, MY", anzahl_objekte: 1200, created_by: "Admin", created_at: "2023-03-10", updated_by: "Editor", updated_at: "2024-02-20" },
        { attributtyp: "Attribut", name: "DNA Storage", id: "ATT-00006", type: "Text", publish: false, infotext: loremMix(), kommentar: loremMix(), sammlung: "VS", anzahl_objekte: 750, created_by: "System", created_at: "2023-04-05", updated_by: "Admin", updated_at: "2024-01-25" },
        { attributtyp: "Stammattribut", name: "Inventory History", id: "ATT-00038", type: "Text", publish: false, infotext: loremMix(), kommentar: loremMix(), sammlung: "VS, MY, MO, MIN", anzahl_objekte: 4588, created_by: "Admin", created_at: "2023-01-15", updated_by: "Editor", updated_at: "2024-03-20" },
        { attributtyp: "Attribut", name: "Editor", id: "ATT-00029", type: "Text", publish: true, infotext: loremMix(), kommentar: loremMix(), sammlung: "VS", anzahl_objekte: 3201, created_by: "System", created_at: "2022-11-10", updated_by: "Admin", updated_at: "2024-02-14" },
        { attributtyp: "Attribut", name: "Examination Comment", id: "ATT-00053", type: "Text", publish: false, infotext: loremMix(), kommentar: loremMix(), sammlung: "VS, MIN", anzahl_objekte: 1542, created_by: "Editor", created_at: "2023-05-22", updated_by: "Editor", updated_at: "2024-01-08" },
        { attributtyp: "Attribut", name: "Expedition", id: "ATT-00026", type: "Text", publish: true, infotext: loremMix(), kommentar: loremMix(), sammlung: "VS, MIN", anzahl_objekte: 892, created_by: "Admin", created_at: "2023-02-18", updated_by: "System", updated_at: "2024-03-15" },
        { attributtyp: "Attribut", name: "General Topic", id: "ATT-00033", type: "Text", publish: true, infotext: loremMix(), kommentar: loremMix(), sammlung: "VS", anzahl_objekte: 1200, created_by: "Admin", created_at: "2023-03-10", updated_by: "Editor", updated_at: "2024-02-20" },
        { attributtyp: "Thesaurus", name: "Habitat", id: "ATT-00023", type: "Text", publish: true, infotext: loremMix(), kommentar: loremMix(), sammlung: "VS, MY, MO", anzahl_objekte: 750, created_by: "System", created_at: "2023-04-05", updated_by: "Admin", updated_at: "2024-01-25" },
        { attributtyp: "Attribut", name: "Individuum comment", id: "ATT-00010", type: "Text", publish: false, infotext: loremMix(), kommentar: loremMix(), sammlung: "VS", anzahl_objekte: 4588, created_by: "Admin", created_at: "2023-01-15", updated_by: "Editor", updated_at: "2024-03-20" },
        { attributtyp: "Attribut", name: "Field number", id: "ATT-00007", type: "Text", publish: true, infotext: loremMix(), kommentar: loremMix(), sammlung: "VS, MIN", anzahl_objekte: 3201, created_by: "System", created_at: "2022-11-10", updated_by: "Admin", updated_at: "2024-02-14" },
        { attributtyp: "Attribut", name: "Iris", id: "ATT-00058", type: "Text", publish: false, infotext: loremMix(), kommentar: loremMix(), sammlung: "VS", anzahl_objekte: 1542, created_by: "Editor", created_at: "2023-05-22", updated_by: "Editor", updated_at: "2024-01-08" },
        { attributtyp: "Thesaurus", name: "Label printed", id: "ATT-00051", type: "Yes/No", publish: true, infotext: loremMix(), kommentar: loremMix(), sammlung: "VS", anzahl_objekte: 892, created_by: "Admin", created_at: "2023-02-18", updated_by: "System", updated_at: "2024-03-15" },
        { attributtyp: "Stammattribut", name: "Inventorybook origin name", id: "ATT-00011", type: "Text", publish: false, infotext: loremMix(), kommentar: loremMix(), sammlung: "VS", anzahl_objekte: 1200, created_by: "Admin", created_at: "2023-03-10", updated_by: "Editor", updated_at: "2024-02-20" },
        { attributtyp: "Attribut", name: "from captivity", id: "ATT-00046", type: "Yes/No", publish: true, infotext: loremMix(), kommentar: loremMix(), sammlung: "VS", anzahl_objekte: 750, created_by: "System", created_at: "2023-04-05", updated_by: "Admin", updated_at: "2024-01-25" },
        { attributtyp: "Thesaurus", name: "Datasource", id: "ATT-00003", type: "Text", publish: true, infotext: loremMix(), kommentar: loremMix(), sammlung: "VS", anzahl_objekte: 4588, created_by: "Admin", created_at: "2023-01-15", updated_by: "Editor", updated_at: "2024-03-20" },
        { attributtyp: "Attribut", name: "Count (male)", id: "ATT-00016", type: "Metric (0)", publish: true, infotext: loremMix(), kommentar: loremMix(), sammlung: "VS", anzahl_objekte: 3201, created_by: "System", created_at: "2022-11-10", updated_by: "Admin", updated_at: "2024-02-14" }
    ];

    window.loremMix = loremMix;
    window.tableData = tableData;
})();
