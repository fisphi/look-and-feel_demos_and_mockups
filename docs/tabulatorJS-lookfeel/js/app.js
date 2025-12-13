(function () {
            const chipContainer = document.getElementById("facet-chips");
            const recordCountsElement = document.getElementById("recordCounts");
            const themeToggleButton = document.getElementById("themeToggle");
            const resetFiltersButton = document.getElementById("resetFilters");
            const tooltipElement = document.getElementById("textTooltip");
            const editModal = document.getElementById("editModal");
    const globalSearchInput = document.getElementById("globalSearch");
    const clearGlobalSearchButton = document.getElementById("clearGlobalSearch");
    const downloadCsvFilteredButton = document.getElementById("downloadCsvFiltered");
    const downloadCsvAllButton = document.getElementById("downloadCsvAll");

            const modalFields = {
                attributtyp: document.getElementById("modal-attributtyp"),
                name: document.getElementById("modal-name"),
                id: document.getElementById("modal-id"),
                type: document.getElementById("modal-type"),
                publish: document.getElementById("modal-publish"),
                infotext: document.getElementById("modal-infotext"),
                kommentar: document.getElementById("modal-kommentar")
            };

            const modalButtons = {
                cancel: document.getElementById("modalCancel"),
                save: document.getElementById("modalSave")
            };

            const tableData = window.tableData || [];
            const THEME_STORAGE_KEY = "tabulatorTheme";
            const MIDNIGHT_THEME_HREF = "https://unpkg.com/tabulator-tables@6.2.5/dist/css/tabulator_midnight.min.css";

            const FIELD_WEIGHTS = {
                name: 5,
                id: 4,
                attributtyp: 3,
                infotext: 2,
                kommentar: 1
            };
            const DEFAULT_WEIGHT = 1;

            function createDefaultFilters() {
                return {
                    attributtyp: null,
                    type: null,
                    publish: null,
                    sammlung: null
                };
            }

            let activeFilters = createDefaultFilters();
            let globalSearchQuery = "";
            let currentEditRow = null;
            let table = null;
            let filteredCount = 0;
            let midnightThemeLink = null;

            function updateSelectCheckedState(selectElement) {
                if (!selectElement) return;
                Array.from(selectElement.options).forEach(option => {
                    if (option.selected) {
                        option.setAttribute("checked", "checked");
                    } else {
                        option.removeAttribute("checked");
                    }
                });
            }

            function createSelectFilter(options, onChange) {
                const select = document.createElement("select");
                select.className = "multi-select";

                const defaultOption = document.createElement("option");
                defaultOption.value = "";
                defaultOption.textContent = "All";
                select.appendChild(defaultOption);

                options.forEach(option => {
                    const opt = document.createElement("option");
                    opt.value = option.value;
                    opt.textContent = option.label;
                    select.appendChild(opt);
                });

                select.addEventListener("change", () => {
                    updateSelectCheckedState(select);
                    onChange(select.value);
                });
                updateSelectCheckedState(select);
                return select;
            }

            function getUniqueValues(data, field) {
                return Array.from(new Set(data.map(item => item[field]))).sort();
            }

            function resetSelectElement(select) {
                if (select.multiple) {
                    select.querySelectorAll("option").forEach(option => {
                        option.selected = false;
                    });
                } else {
                    select.value = "";
                }
                updateSelectCheckedState(select);
                select.dispatchEvent(new Event("change", { bubbles: true }));
            }

            function resetHeaderFilters() {
                document.querySelectorAll("select.multi-select").forEach(resetSelectElement);
            }

            function clearFilterValue(filterType, value) {
                const currentValue = activeFilters[filterType];

                if (Array.isArray(currentValue)) {
                    activeFilters[filterType] = currentValue.filter(item => item !== value);
                    if (activeFilters[filterType].length === 0) {
                        activeFilters[filterType] = null;
                    }
                } else {
                    activeFilters[filterType] = null;
                }
            }

            function buildChip({ cssClass, label, filterKey, value }) {
                const chip = document.createElement("div");
                chip.className = `chip ${cssClass}`;
                chip.innerHTML = `${label} <span data-type="${filterKey}" data-value="${value}">×</span>`;
                chip.querySelector("span").onclick = () => {
                    clearFilterValue(filterKey, value);
                    updateFilter();
                };
                return chip;
            }

            function renderChips() {
                chipContainer.innerHTML = "";

                if (activeFilters.attributtyp) {
                    const value = activeFilters.attributtyp;
                    chipContainer.appendChild(buildChip({
                        cssClass: value.toLowerCase().replace(/\s/g, ""),
                        label: `Attributart: ${value}`,
                        filterKey: "attributtyp",
                        value
                    }));
                }

                if (activeFilters.type) {
                    chipContainer.appendChild(buildChip({
                        cssClass: "type",
                        label: `Type: ${activeFilters.type}`,
                        filterKey: "type",
                        value: activeFilters.type
                    }));
                }

                if (activeFilters.publish !== null) {
                    const text = activeFilters.publish ? "Yes" : "No";
                    chipContainer.appendChild(buildChip({
                        cssClass: `publish ${activeFilters.publish ? "publish-true" : "publish-false"}`,
                        label: `Public: ${text}`,
                        filterKey: "publish",
                        value: activeFilters.publish
                    }));
                }

                if (activeFilters.sammlung) {
                    chipContainer.appendChild(buildChip({
                        cssClass: "sammlung",
                        label: `Sammlung: ${activeFilters.sammlung}`,
                        filterKey: "sammlung",
                        value: activeFilters.sammlung
                    }));
                }
            }

            function sanitizeTooltipContent(text) {
                return (text || "").replace(/'/g, "&apos;");
            }

            function positionTooltip(event) {
                const x = event.clientX + 15;
                const y = event.clientY + 15;
                tooltipElement.style.left = `${x}px`;
                tooltipElement.style.top = `${y}px`;
            }

            function showTooltip(event, text) {
                tooltipElement.innerHTML = text;
                tooltipElement.classList.add("active");
                positionTooltip(event);
            }

            function showIDTooltip(event, id) {
                tooltipElement.textContent = `ID: ${id}\nSammlung: VS\nObjekte: 4588`;
                tooltipElement.classList.add("active");
                positionTooltip(event);
            }

            function hideTooltip() {
                tooltipElement.classList.remove("active");
            }

            function normalizeValue(value) {
                if (value === null || value === undefined) {
                    return "";
                }
                return typeof value === "string" ? value : String(value);
            }

            function computeMatchPositions(text, query) {
                const source = normalizeValue(text);
                const needle = normalizeValue(query).trim();
                if (!needle) return null;

                const haystack = source.toLowerCase();
                const target = needle.toLowerCase();
                const startIndex = haystack.indexOf(target);

                if (startIndex === -1) return null;

                const positions = [];
                for (let i = 0; i < target.length; i++) {
                    positions.push(startIndex + i);
                }
                return positions;
            }

            function fuzzyMatch(query, text) {
                const positions = computeMatchPositions(text, query);
                return positions ? positions.length : 0;
            }

            function fuzzyHighlight(text, query) {
                const value = normalizeValue(text);
                const positions = computeMatchPositions(value, query);
                if (!positions || positions.length === 0) {
                    return value;
                }

                const lookup = new Set(positions);
                let highlighted = "";

                for (let i = 0; i < value.length; i++) {
                    const char = value[i];
                    highlighted += lookup.has(i) ? `<span class="hl">${char}</span>` : char;
                }

                return highlighted;
            }

            function weightedRowScore(data, query) {
                const normalizedQuery = normalizeValue(query).trim();
                if (!normalizedQuery) return 0;

                return Object.keys(data).reduce((score, key) => {
                    const value = normalizeValue(data[key]);
                    if (!value) return score;

                    const matchScore = fuzzyMatch(normalizedQuery, value);
                    if (!matchScore) return score;

                    const weight = FIELD_WEIGHTS[key] || DEFAULT_WEIGHT;
                    return score + (matchScore * weight);
                }, 0);
            }

            function attributtypHeaderFilter() {
                const values = ["Attribut", "Stammattribut", "Thesaurus"].map(value => ({ value, label: value }));
                return createSelectFilter(values, (value) => {
                    activeFilters.attributtyp = value || null;
                    updateFilter();
                });
            }

            function typeHeaderFilter() {
                const values = getUniqueValues(tableData, "type").map(value => ({ value, label: value }));
                return createSelectFilter(values, (value) => {
                    activeFilters.type = value || null;
                    updateFilter();
                });
            }

            function publishHeaderFilter() {
                const values = [
                    { value: "true", label: "Publiziert" },
                    { value: "false", label: "Nicht publiziert" }
                ];
                return createSelectFilter(values, (value) => {
                    activeFilters.publish = value === "" ? null : value === "true";
                    updateFilter();
                });
            }

            function sammlungHeaderFilter() {
                const values = getUniqueValues(tableData, "sammlung").map(value => ({ value, label: value }));
                return createSelectFilter(values, (value) => {
                    activeFilters.sammlung = value || null;
                    updateFilter();
                });
            }

            function attributtypFormatter(cell) {
                const value = cell.getValue() || "";
                const cssClass = value.toLowerCase().replace(/\s/g, "");
                const highlighted = fuzzyHighlight(value, globalSearchQuery);
                return `<div class="attributtyp-cell ${cssClass}">${highlighted}</div>`;
            }

            function idFormatter(cell) {
                const value = cell.getValue() || "";
                const highlighted = fuzzyHighlight(value, globalSearchQuery);
                return `<div class="cell-id" 
                    onmouseenter="showIDTooltip(event, '${value}')" 
                    onmouseleave="hideTooltip()">${highlighted}</div>`;
            }

            function longTextFormatter(cell) {
                const value = cell.getValue() || "";
                const tooltipText = sanitizeTooltipContent(value);
                const highlighted = fuzzyHighlight(value, globalSearchQuery);
                return `<div class="cell-longtext" 
                    onmouseenter="showTooltip(event, '${tooltipText}')" 
                    onmouseleave="hideTooltip()">${highlighted}</div>`;
            }

            function kommentarFormatter(cell) {
                const value = cell.getValue() || "";
                const highlighted = fuzzyHighlight(value, globalSearchQuery);
                return `<div class="cell-kommentar">${highlighted}</div>`;
            }

            function textFormatter(cell) {
                const value = cell.getValue() || "";
                return fuzzyHighlight(value, globalSearchQuery);
            }

            function publishFormatter(cell) {
                const value = cell.getValue();
                return `<span class="publish-icon ${value ? "true" : "false"}" title="${value ? "Publiziert" : "Nicht publiziert"}">${value ? "🌐" : "🔒"}</span>`;
            }

            function editFormatter() {
                return `<button class="edit-btn" title="Edit" aria-label="Edit" onclick="openEditModal(event)">
                        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
                            <path d="M20.71 7.04a1 1 0 0 0 0-1.41L18.37 3.29a1 1 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" />
                        </svg>
                    </button>`;
            }

            function setModalFieldValues(data) {
                modalFields.attributtyp.value = data.attributtyp || "";
                modalFields.name.value = data.name || "";
                modalFields.id.value = data.id || "";
                modalFields.type.value = data.type || "";
                modalFields.publish.value = data.publish ? "true" : "false";
                modalFields.infotext.value = data.infotext || "";
                modalFields.kommentar.value = data.kommentar || "";
            }

            function getModalFieldValues() {
                return {
                    attributtyp: modalFields.attributtyp.value,
                    name: modalFields.name.value,
                    id: modalFields.id.value,
                    type: modalFields.type.value,
                    publish: modalFields.publish.value === "true",
                    infotext: modalFields.infotext.value,
                    kommentar: modalFields.kommentar.value
                };
            }

            function openEditModal(event) {
                event.stopPropagation();
                if (!table) return;

                const rowElement = event.target.closest(".tabulator-row");
                if (!rowElement) return;

                currentEditRow = table.getRow(rowElement);
                if (!currentEditRow) return;

                setModalFieldValues(currentEditRow.getData());
                editModal.classList.add("active");
            }

            function closeEditModal() {
                editModal.classList.remove("active");
                currentEditRow = null;
            }

            function saveEdit() {
                if (!currentEditRow) return;
                currentEditRow.update(getModalFieldValues());
                closeEditModal();
            }

            function handleResponsiveToggleKeydown(event) {
                if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    event.currentTarget.click();
                }
            }

            function enhanceResponsiveToggleAccess(rowElement) {
                if (!rowElement) return;
                const toggle = rowElement.querySelector(".tabulator-responsive-collapse-toggle");
                if (!toggle || toggle.dataset.accessibilityEnhanced === "true") {
                    return;
                }
                toggle.setAttribute("tabindex", "0");
                toggle.setAttribute("role", "button");
                toggle.setAttribute("aria-label", "Zeile ein- oder ausklappen");
                toggle.dataset.accessibilityEnhanced = "true";
                toggle.addEventListener("keydown", handleResponsiveToggleKeydown);
            }

            function formatPublishState(row) {
                const rowElement = row.getElement();
                if (!rowElement) return;

                if (row.getData().publish) {
                    rowElement.classList.add("published");
                } else {
                    rowElement.classList.remove("published");
                }

                enhanceResponsiveToggleAccess(rowElement);
            }

            const columnDefinitions = [
                { formatter: "responsiveCollapse", width: 40, minWidth: 40, hozAlign: "center", resizable: false, headerSort: false, responsive: 0 },
                {
                    title: "Attributart",
                    field: "attributtyp",
                    formatter: attributtypFormatter,
                    headerFilter: attributtypHeaderFilter,
                    width: 120,
                    responsive: 0
                },
                { title: "ID", field: "id", formatter: idFormatter, headerFilter: "input", width: 100, responsive: 1 },
                {
                    title: "Public",
                    field: "publish",
                    formatter: publishFormatter,
                    headerFilter: publishHeaderFilter,
                    hozAlign: "center",
                    width: 60,
                    responsive: 3
                },
                { title: "Name", field: "name", formatter: textFormatter, headerFilter: "input", minWidth: 200, responsive: 0 },
                { title: "Infotext", field: "infotext", formatter: longTextFormatter, headerFilter: "input", minWidth: 250, headerSort: false, responsive: 10 },
                { title: "Mapping", field: "maps_to", formatter: textFormatter, headerFilter: "input", minWidth: 200, responsive: 5 },
                { title: "Type", field: "type", formatter: textFormatter, headerFilter: typeHeaderFilter, width: 120, responsive: 2 },
                { title: "in Sammlung", field: "sammlung", formatter: textFormatter, headerFilter: "input", minWidth: 120, responsive: 5 },
                { title: "in Objekten", field: "anzahl_objekte", width: 70, responsive: 13 },
                { title: "Geändert am", field: "updated_at", formatter: textFormatter, width: 110, responsive: 5 },
                { title: "Geändert von", field: "updated_by", formatter: textFormatter, width: 50, responsive: 15 },
                { title: "Erstellt am", field: "created_at", formatter: textFormatter, width: 110, responsive: 15 },
                { title: "Erstellt von", field: "created_by", formatter: textFormatter, width: 50, responsive: 15 },
                { title: "Kommentar", field: "kommentar", formatter: kommentarFormatter, headerFilter: "input", minWidth: 250, headerSort: false, responsive: 16 },
                { title: "", formatter: editFormatter, width: 70, hozAlign: "center", responsive: 0 }
            ];

            table = new Tabulator("#attribute-table", {
                layout: "fitColumns",
                data: tableData,
                theme: "default",
                responsiveLayout: "collapse",
                responsiveLayoutCollapseStartOpen: false,
                pagination: true,
                paginationSize: 50,
                paginationSizeSelector: [10, 20, 50, 100],
                rowFormatter: formatPublishState,
                columns: columnDefinitions
            });
            renderRecordCounts();
            if (document.body.classList.contains("dark-mode")) {
                syncTabulatorTheme(true);
            }

            function buildFacetFilters() {
                const filters = [];

                if (activeFilters.attributtyp) {
                    filters.push({ field: "attributtyp", type: "=", value: activeFilters.attributtyp });
                }

                if (activeFilters.publish !== null) {
                    filters.push({ field: "publish", type: "=", value: activeFilters.publish });
                }

                if (activeFilters.type) {
                    filters.push({ field: "type", type: "=", value: activeFilters.type });
                }

                if (activeFilters.sammlung) {
                    filters.push({ field: "sammlung", type: "like", value: activeFilters.sammlung });
                }

                return filters;
            }

            function globalSearchFilter(data) {
                return weightedRowScore(data, globalSearchQuery) > 0;
            }

            function applyFilters(clearHeaderFilters = false) {
                const facetFilters = buildFacetFilters();
                const hasFacetFilters = facetFilters.length > 0;
                const hasQuery = Boolean(globalSearchQuery);

                if (!hasFacetFilters && !hasQuery) {
                    table.clearFilter(clearHeaderFilters);
                    renderChips();
                    renderRecordCounts();
                    table.redraw(true);
                    return;
                }

                if (clearHeaderFilters) {
                    table.clearFilter(true);
                }

                if (hasQuery) {
                    table.setFilter(globalSearchFilter);
                    facetFilters.forEach(filter => {
                        table.addFilter(filter.field, filter.type, filter.value);
                    });
                } else if (hasFacetFilters) {
                    table.setFilter(facetFilters);
                }

                renderChips();
                renderRecordCounts();
                table.redraw(true);
            }

            function updateFilter() {
                applyFilters(true);
            }
            function renderRecordCounts() {
                if (!recordCountsElement) return;
                const totalCount = tableData.length;
                const activeCount = table ? table.getDataCount("active") : totalCount;
                filteredCount = activeCount;
                let label;
                if (activeCount === totalCount) {
                    label = `${totalCount} Datensätze`;
                } else if (activeCount === 0) {
                    label = "0 Datensätze";
                } else {
                    label = `${activeCount} von ${totalCount} Datensätzen`;
                }
                recordCountsElement.textContent = label;
            }

            function syncTabulatorTheme(isDark) {
                if (!table) return;
                table.setTheme(isDark ? "midnight" : "default");
            }

            function ensureMidnightStylesheet() {
                if (midnightThemeLink || document.querySelector('link[data-tabulator-theme="midnight"]')) {
                    midnightThemeLink = midnightThemeLink || document.querySelector('link[data-tabulator-theme="midnight"]');
                    return midnightThemeLink;
                }
                const link = document.createElement("link");
                link.rel = "stylesheet";
                link.href = MIDNIGHT_THEME_HREF;
                link.dataset.tabulatorTheme = "midnight";
                link.disabled = true;
                document.head.appendChild(link);
                midnightThemeLink = link;
                return link;
            }

            function applyThemePreference(theme) {
                const isDark = theme === "dark";
                document.body.classList.toggle("dark-mode", isDark);
                if (themeToggleButton) {
                    themeToggleButton.textContent = isDark ? "Light Mode" : "Dark Mode";
                    themeToggleButton.setAttribute("aria-pressed", String(isDark));
                }
                if (isDark) {
                    ensureMidnightStylesheet().disabled = false;
                } else if (midnightThemeLink || document.querySelector('link[data-tabulator-theme="midnight"]')) {
                    const link = ensureMidnightStylesheet();
                    link.disabled = true;
                }
                syncTabulatorTheme(isDark);
            }

            function toggleThemePreference() {
                const isDark = document.body.classList.contains("dark-mode");
                const newTheme = isDark ? "light" : "dark";
                try {
                    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
                } catch (error) {
                    /* ignore storage errors */
                }
                applyThemePreference(newTheme);
            }

            function clearAllFilters() {
                activeFilters = createDefaultFilters();
            }

            function resetAllFiltersAndSearch() {
                clearAllFilters();
                globalSearchQuery = "";
                if (globalSearchInput) {
                    globalSearchInput.value = "";
                }
                applyFilters(true);
                resetHeaderFilters();
            }

            function focusGlobalSearchField() {
                if (!globalSearchInput) return;
                globalSearchInput.focus({ preventScroll: true });
                globalSearchInput.select();
            }

            function isElementInsideTable(element) {
                if (!element || typeof element.closest !== "function") {
                    return false;
                }
                return Boolean(element.closest("#attribute-table"));
            }

            function getExportableColumns() {
                return columnDefinitions.filter(column => Boolean(column.field));
            }

            function collectRowData(includeAll = false) {
                if (!table) return [];
                const scope = includeAll ? "all" : "active";
                let rows = table.getRows(scope) || [];
                if (includeAll && rows.length === 0) {
                    rows = table.getRows() || [];
                }
                return rows.map(row => row.getData());
            }

            function escapeCsvValue(value) {
                if (value === null || value === undefined) {
                    return "";
                }
                return normalizeValue(value).replace(/"/g, '""');
            }

            function buildCsvContent(rows, columns) {
                const header = columns.map(col => `"${escapeCsvValue(col.title || col.field)}"`).join(",");
                const body = rows.map(row => columns.map(col => `"${escapeCsvValue(row[col.field])}"`).join(","));
                return [header, ...body].join("\r\n");
            }

            function triggerCsvDownload(csvContent, filename) {
                const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
                const url = URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = filename;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                URL.revokeObjectURL(url);
            }

            function handleCsvDownload(includeAll = false) {
                const rows = collectRowData(includeAll);
                if (rows.length === 0) {
                    alert("Keine Datensätze für den Export verfügbar.");
                    return;
                }
                const columns = getExportableColumns();
                const csvContent = buildCsvContent(rows, columns);
                const filename = includeAll ? "attribute_export_all.csv" : "attribute_export_filtered.csv";
                triggerCsvDownload(csvContent, filename);
            }

            resetFiltersButton.addEventListener("click", resetAllFiltersAndSearch);

            if (themeToggleButton) {
                themeToggleButton.addEventListener("click", toggleThemePreference);
            }

    globalSearchInput.addEventListener("input", (event) => {
        globalSearchQuery = (event.target.value || "").trim();
        applyFilters(false);
    });

    if (clearGlobalSearchButton) {
        clearGlobalSearchButton.addEventListener("click", () => {
            globalSearchInput.value = "";
            globalSearchQuery = "";
            applyFilters(false);
        });
    }

    if (downloadCsvFilteredButton) {
        downloadCsvFilteredButton.addEventListener("click", () => handleCsvDownload(false));
    }

    if (downloadCsvAllButton) {
        downloadCsvAllButton.addEventListener("click", () => handleCsvDownload(true));
    }

    let initialTheme = "light";
    try {
        const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
        if (storedTheme) {
            initialTheme = storedTheme;
        }
    } catch (error) {
        /* ignore storage errors */
    }
    applyThemePreference(initialTheme);

    document.addEventListener("keydown", (event) => {
        const key = (event.key || "").toLowerCase();
        const activeElement = document.activeElement;
        const hasMeta = event.metaKey;

        const focusGlobalSearchShortcut = !hasMeta && !event.shiftKey && key === "f" && (event.ctrlKey || event.altKey);
        if (focusGlobalSearchShortcut) {
            event.preventDefault();
            focusGlobalSearchField();
            return;
        }

        const resetShortcut = !hasMeta && !event.shiftKey && key === "r" && (event.ctrlKey || event.altKey);
        if (resetShortcut && isElementInsideTable(activeElement)) {
            event.preventDefault();
            resetAllFiltersAndSearch();
            return;
        }

        const exportShortcut = !hasMeta && key === "s" && event.ctrlKey;
        if (exportShortcut) {
            event.preventDefault();
            const exportAll = event.shiftKey;
            handleCsvDownload(exportAll);
        }
    });

            modalButtons.cancel.addEventListener("click", closeEditModal);
            modalButtons.save.addEventListener("click", saveEdit);

            editModal.addEventListener("click", (event) => {
                if (event.target === editModal) {
                    closeEditModal();
                }
            });

            renderChips();

            window.showTooltip = showTooltip;
            window.showIDTooltip = showIDTooltip;
            window.hideTooltip = hideTooltip;
            window.openEditModal = openEditModal;
        })();
