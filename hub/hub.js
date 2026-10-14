(() => {
  const sampleEnquiries = [
    { id: 1, name: "Amina Bello", phone: "+234 803 555 0101", event: "Wedding", date: "2026-10-24", guests: 250, status: "Quoted", notes: "Jollof rice, fried rice and small chops", color: "peach", followup: "2026-10-15" },
    { id: 2, name: "Tunde Adebayo", phone: "+234 806 555 0102", event: "Corporate event", date: "2026-10-20", guests: 80, status: "Follow-up", notes: "Lunch packs for a staff training", color: "blue", followup: "2026-10-14" },
    { id: 3, name: "Kemi Oladipo", phone: "+234 809 555 0103", event: "Birthday", date: "2026-11-08", guests: 120, status: "New", notes: "Birthday celebration, menu to be discussed", color: "gold", followup: "2026-10-16" },
    { id: 4, name: "Musa Ibrahim", phone: "+234 701 555 0104", event: "Private party", date: "2026-10-18", guests: 60, status: "Confirmed", notes: "Amala, ewedu and assorted meat", color: "green", followup: "" },
    { id: 5, name: "Bisi Adekunle", phone: "+234 812 555 0105", event: "Family gathering", date: "2026-11-14", guests: 45, status: "Contacted", notes: "Traditional dishes and drinks", color: "lavender", followup: "2026-10-17" },
    { id: 6, name: "Chidi Okafor", phone: "+234 814 555 0106", event: "Wedding", date: "2026-12-05", guests: 300, status: "Confirmed", notes: "Wedding reception catering", color: "peach", followup: "" }
  ];
  const STORAGE_KEY = "sasham-catering-hub-preview-v1";
  const loadEnquiries = () => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === null) {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sampleEnquiries));
        return sampleEnquiries.map(item => ({ ...item }));
      }
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : sampleEnquiries.map(item => ({ ...item }));
    } catch {
      return sampleEnquiries.map(item => ({ ...item }));
    }
  };
  let enquiries = loadEnquiries();
  const $ = (selector) => document.querySelector(selector);
  const escapeHtml = (value) => String(value ?? "").replace(/[&<>"']/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[char]));
  const initials = (name) => name.split(/\s+/).slice(0, 2).map(part => part[0] || "").join("").toUpperCase();
  const formatDate = (value, includeYear = false) => {
    if (!value) return "Date not set";
    const date = new Date(value + "T12:00:00");
    return new Intl.DateTimeFormat("en-NG", { day: "numeric", month: "short", ...(includeYear ? { year: "numeric" } : {}) }).format(date);
  };
  const statusClass = (status) => "status-" + status.toLowerCase().replace(/\s+/g, "-");
  const palette = { peach: ["#f9e2d6", "#9b5437"], blue: ["#e3ebfb", "#4c6397"], gold: ["#f8edcf", "#8b6b27"], green: ["#e0f0e4", "#36714b"], lavender: ["#eee7fb", "#7960a4"] };

  function renderRows() {
    const query = $("#searchInput").value.trim().toLowerCase();
    const filter = $("#statusFilter").value;
    const visible = enquiries.filter(item => {
      const matchesQuery = [item.name, item.phone, item.event, item.notes].some(value => String(value || "").toLowerCase().includes(query));
      return matchesQuery && (filter === "all" || item.status === filter);
    });
    $("#enquiryRows").innerHTML = visible.length ? visible.map(item => {
      const colors = palette[item.color] || palette.peach;
      return `<tr>
        <td><div class="customer-cell"><span class="customer-avatar" style="background:${colors[0]};color:${colors[1]}">${escapeHtml(initials(item.name))}</span><div><div class="customer-name">${escapeHtml(item.name)}</div><div class="customer-phone">${escapeHtml(item.phone)}</div></div></div></td>
        <td><div class="event-name">${escapeHtml(item.event)}</div><div class="event-meta">${item.guests ? escapeHtml(item.guests) + " guests" : "Guest count pending"}</div></td>
        <td>${escapeHtml(formatDate(item.date, true))}</td>
        <td><label class="sr-only" for="status-${item.id}">Status for ${escapeHtml(item.name)}</label><select id="status-${item.id}" class="status-select ${statusClass(item.status)}" data-status-id="${item.id}">${["New","Contacted","Quoted","Follow-up","Confirmed","Lost"].map(status => `<option ${status === item.status ? "selected" : ""}>${status}</option>`).join("")}</select></td>
        <td><button class="text-button details-button" data-details-id="${item.id}" aria-label="View details for ${escapeHtml(item.name)}">Details ↗</button></td>
      </tr>`;
    }).join("") : '<tr><td colspan="5"><div class="empty-state">No enquiries match your search.</div></td></tr>';
    $("#resultsCount").textContent = `Showing ${visible.length} of ${enquiries.length} enquiries`;
    $("#navEnquiryCount").textContent = enquiries.length;
  }

  function renderStats() {
    $("#totalEnquiries").textContent = String(enquiries.length).padStart(2, "0");
    $("#awaitingQuotes").textContent = String(enquiries.filter(item => ["New", "Contacted"].includes(item.status)).length).padStart(2, "0");
    $("#confirmedEvents").textContent = String(enquiries.filter(item => item.status === "Confirmed").length).padStart(2, "0");
    $("#followupsDue").textContent = String(enquiries.filter(item => item.status === "Follow-up").length).padStart(2, "0");
  }

  function renderUpcoming() {
    const events = enquiries.filter(item => item.status === "Confirmed" && item.date).sort((a, b) => a.date.localeCompare(b.date));
    $("#upcomingList").innerHTML = events.length ? events.map(item => {
      const date = new Date(item.date + "T12:00:00");
      const day = date.toLocaleDateString("en-NG", { day: "2-digit" });
      const month = date.toLocaleDateString("en-NG", { month: "short" }).toUpperCase();
      return `<div class="upcoming-item"><div class="date-tile"><span>${escapeHtml(month)}</span><strong>${escapeHtml(day)}</strong></div><div class="upcoming-info"><strong>${escapeHtml(item.event)} · ${escapeHtml(item.name)}</strong><span>${escapeHtml(formatDate(item.date, true))}</span></div><span class="guest-count">${item.guests ? escapeHtml(item.guests) + " guests" : ""}</span></div>`;
    }).join("") : '<div class="empty-state">No confirmed events yet.</div>';
  }

  function renderFollowups() {
    const items = enquiries.filter(item => item.status === "Follow-up" || item.status === "Quoted").sort((a, b) => (a.followup || "9999-99-99").localeCompare(b.followup || "9999-99-99"));
    $("#followupList").innerHTML = items.length ? items.map(item => `<div class="followup-item"><span class="followup-avatar">${escapeHtml(initials(item.name))}</span><div class="followup-copy"><strong>${escapeHtml(item.name)}</strong><p>${item.status === "Quoted" ? "Check whether they reviewed the quote" : "Follow up about " + escapeHtml(item.event.toLowerCase())}</p></div><span class="followup-date">${item.followup ? escapeHtml(formatDate(item.followup)) : "Set date"}</span></div>`).join("") : '<div class="empty-state">No follow-ups at the moment.</div>';
  }

  function saveEnquiries() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(enquiries));
      const notice = $("#saveNotice");
      if (notice) notice.textContent = "Saved in this browser";
    } catch {
      const notice = $("#saveNotice");
      if (notice) notice.textContent = "Could not save in this browser";
    }
  }

  function render() {
    renderRows();
    renderStats();
    renderUpcoming();
    renderFollowups();
    saveEnquiries();
  }

  function exportCsv() {
    const columns = [
      ["Customer", "name"], ["Phone", "phone"], ["Event", "event"],
      ["Event date", "date"], ["Guests", "guests"], ["Status", "status"],
      ["Follow-up date", "followup"], ["Notes", "notes"]
    ];
    const csvCell = value => {
      const raw = String(value ?? "");
      const safe = /^[=+\-@\t\r]/.test(raw) ? "\u2019" + raw : raw;
      return '"' + safe.replace(/"/g, '""') + '"';
    };
    const csv = [columns.map(([label]) => csvCell(label)).join(",")]
      .concat(enquiries.map(item => columns.map(([, key]) => csvCell(item[key])).join(",")))
      .join("\\r\\n");
    const blob = new Blob(["\\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "sasham-enquiries-preview.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  const dialog = $("#enquiryDialog");
  $("#addEnquiryBtn").addEventListener("click", () => dialog.showModal());
  $("#exportCsvBtn").addEventListener("click", exportCsv);
  $("#closeDialog").addEventListener("click", () => dialog.close());
  $("#cancelDialog").addEventListener("click", () => dialog.close());
  $("#searchInput").addEventListener("input", renderRows);
  $("#statusFilter").addEventListener("change", renderRows);
  $("#viewAllBtn").addEventListener("click", () => { $("#statusFilter").value = "all"; $("#searchInput").value = ""; renderRows(); $("#enquiries").scrollIntoView({ behavior: "smooth", block: "start" }); });

  $("#enquiryRows").addEventListener("change", event => {
    const select = event.target.closest("[data-status-id]");
    if (!select) return;
    const record = enquiries.find(item => item.id === Number(select.dataset.statusId));
    if (!record) return;
    record.status = select.value;
    render();
  });

  $("#enquiryRows").addEventListener("click", event => {
    const button = event.target.closest("[data-details-id]");
    if (!button) return;
    const item = enquiries.find(record => record.id === Number(button.dataset.detailsId));
    if (!item) return;
    window.alert(`Enquiry details (sample preview)\n\nCustomer: ${item.name}\nPhone: ${item.phone}\nEvent: ${item.event}\nDate: ${formatDate(item.date, true)}\nGuests: ${item.guests || "Not provided"}\nStatus: ${item.status}\nNotes: ${item.notes || "None"}`);
  });

  $("#enquiryForm").addEventListener("submit", event => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "").trim();
    const phone = String(form.get("phone") || "").trim();
    const date = String(form.get("date") || "");
    if (!name || !phone || !date) return;
    enquiries.unshift({
      id: Math.max(0, ...enquiries.map(item => item.id)) + 1,
      name, phone, date,
      event: String(form.get("event") || "Other"),
      guests: Number(form.get("guests")) || 0,
      status: String(form.get("status") || "New"),
      notes: String(form.get("notes") || "").trim(),
      color: ["peach", "blue", "gold", "green", "lavender"][enquiries.length % 5],
      followup: ""
    });
    render();
    event.currentTarget.reset();
    dialog.close();
  });

  $("#mobileMenu").addEventListener("click", () => {
    const open = $("#sidebar").classList.toggle("open");
    $("#mobileMenu").setAttribute("aria-expanded", String(open));
  });
  document.addEventListener("click", event => {
    if (window.innerWidth <= 700 && $("#sidebar").classList.contains("open") && !$("#sidebar").contains(event.target) && !$("#mobileMenu").contains(event.target)) {
      $("#sidebar").classList.remove("open");
      $("#mobileMenu").setAttribute("aria-expanded", "false");
    }
  });

  render();
})();