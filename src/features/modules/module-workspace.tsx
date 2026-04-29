"use client";

import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export type CrudField = {
  name: string;
  label: string;
  type?: "text" | "number" | "date" | "select" | "email";
  required?: boolean;
  options?: string[];
};

export type CrudResource = {
  key: string;
  title: string;
  description: string;
  fields: CrudField[];
  seed: Record<string, string>[];
};

type RecordItem = Record<string, string> & { id: string; updatedAt: string };

type FormState = Record<string, string>;

function createId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createSeed(resource: CrudResource): RecordItem[] {
  return resource.seed.map((item, index) => ({
    id: `${resource.key}-${index + 1}`,
    updatedAt: new Date().toISOString(),
    ...item,
  }));
}

function emptyState(resource: CrudResource): FormState {
  return Object.fromEntries(resource.fields.map((field) => [field.name, ""]));
}

export function ModuleWorkspace({ resources, storageKey }: { resources: CrudResource[]; storageKey: string }) {
  const [activeKey, setActiveKey] = useState(resources[0]?.key ?? "");
  const [records, setRecords] = useState<Record<string, RecordItem[]>>(() => {
    const fallback = Object.fromEntries(resources.map((resource) => [resource.key, createSeed(resource)]));

    if (typeof window === "undefined") {
      return fallback;
    }

    const saved = window.localStorage.getItem(storageKey);
    return saved ? JSON.parse(saved) : fallback;
  });
  const [formState, setFormState] = useState<FormState>(() => emptyState(resources[0]));
  const [editingId, setEditingId] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [message, setMessage] = useState("");

  const activeResource = useMemo(
    () => resources.find((resource) => resource.key === activeKey) ?? resources[0],
    [activeKey, resources],
  );

  useEffect(() => {
    if (Object.keys(records).length > 0) {
      window.localStorage.setItem(storageKey, JSON.stringify(records));
    }
  }, [records, storageKey]);

  if (!activeResource) {
    return null;
  }

  const activeRecords = records[activeResource.key] ?? [];
  const filteredRecords = activeRecords.filter((record) =>
    Object.values(record).join(" ").toLowerCase().includes(query.toLowerCase()),
  );

  function updateField(name: string, value: string) {
    setFormState((current) => ({ ...current, [name]: value }));
  }

  function resetForm() {
    setFormState(emptyState(activeResource));
    setEditingId(null);
  }

  function submitForm(formData: FormData) {
    const nextState = Object.fromEntries(
      activeResource.fields.map((field) => [field.name, String(formData.get(field.name) ?? "").trim()]),
    );

    const missingField = activeResource.fields.find((field) => field.required && !nextState[field.name]);

    if (missingField) {
      setMessage(`${missingField.label} wajib diisi.`);
      return;
    }

    setRecords((current) => {
      const currentRecords = current[activeResource.key] ?? [];
      const nextRecord = { id: editingId ?? createId(), updatedAt: new Date().toISOString(), ...nextState };
      const nextRecords = editingId
        ? currentRecords.map((record) => (record.id === editingId ? nextRecord : record))
        : [nextRecord, ...currentRecords];

      return { ...current, [activeResource.key]: nextRecords };
    });

    setMessage(editingId ? "Data berhasil diperbarui." : "Data berhasil ditambahkan.");
    resetForm();
  }

  function editRecord(record: RecordItem) {
    setEditingId(record.id);
    setFormState(Object.fromEntries(activeResource.fields.map((field) => [field.name, record[field.name] ?? ""])));
    setMessage("");
  }

  function deleteRecord(id: string) {
    setRecords((current) => ({
      ...current,
      [activeResource.key]: (current[activeResource.key] ?? []).filter((record) => record.id !== id),
    }));
    setMessage("Data berhasil dihapus.");
    if (editingId === id) {
      resetForm();
    }
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[320px_1fr]">
      <aside className="rounded-3xl border border-slate-200/80 bg-white/95 p-4 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
        <div className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-700">Workspace CRUD</div>
        <div className="mt-4 space-y-2">
          {resources.map((resource) => (
            <button
              key={resource.key}
              type="button"
              onClick={() => {
                setActiveKey(resource.key);
                setFormState(emptyState(resource));
                setEditingId(null);
                setMessage("");
                setQuery("");
              }}
              className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                activeResource.key === resource.key
                  ? "border-cyan-200 bg-cyan-50 text-cyan-950"
                  : "border-slate-200 bg-white text-slate-700 hover:border-cyan-200 hover:bg-cyan-50"
              }`}
            >
              <div className="font-semibold">{resource.title}</div>
              <div className="mt-1 text-xs leading-5 text-slate-500">{resource.description}</div>
            </button>
          ))}
        </div>
      </aside>

      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold tracking-tight text-slate-950">{activeResource.title}</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">{activeResource.description}</p>
            </div>
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
              Lokal aktif
            </div>
          </div>

          <form action={submitForm} className="mt-6 grid gap-4 md:grid-cols-2">
            {activeResource.fields.map((field) => (
              <label key={field.name} className="space-y-2 text-sm font-medium text-slate-700">
                <span>{field.label}</span>
                {field.type === "select" ? (
                  <select
                    name={field.name}
                    value={formState[field.name] ?? ""}
                    onChange={(event) => updateField(field.name, event.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                  >
                    <option value="">Pilih {field.label}</option>
                    {field.options?.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    name={field.name}
                    type={field.type ?? "text"}
                    value={formState[field.name] ?? ""}
                    onChange={(event) => updateField(field.name, event.target.value)}
                    className="h-11 w-full rounded-xl border border-slate-200 bg-slate-50/70 px-3 text-sm text-slate-900 outline-none transition focus:border-cyan-500 focus:bg-white focus:ring-4 focus:ring-cyan-100"
                  />
                )}
              </label>
            ))}
            <div className="flex items-end gap-2 md:col-span-2">
              <Button className="h-10 bg-cyan-700 px-4 text-white hover:bg-cyan-800">
                <Plus className="h-4 w-4" />
                {editingId ? "Simpan perubahan" : "Tambah data"}
              </Button>
              {editingId ? (
                <Button type="button" variant="outline" className="h-10" onClick={resetForm}>
                  Batal edit
                </Button>
              ) : null}
            </div>
          </form>

          {message ? <div className="mt-4 rounded-xl border border-cyan-200 bg-cyan-50 px-4 py-3 text-sm text-cyan-800">{message}</div> : null}
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white/95 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.06)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-950">Daftar data</h3>
              <p className="mt-1 text-sm text-slate-500">{filteredRecords.length} dari {activeRecords.length} record</p>
            </div>
            <div className="flex h-10 items-center gap-2 rounded-xl border border-slate-300 px-3 focus-within:border-cyan-600 focus-within:ring-3 focus-within:ring-cyan-100">
              <Search className="h-4 w-4 text-slate-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Cari data..."
                className="min-w-0 bg-transparent text-sm outline-none"
              />
            </div>
          </div>

          <div className="mt-5 overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  {activeResource.fields.map((field) => (
                    <th key={field.name} className="px-4 py-3 font-medium">{field.label}</th>
                  ))}
                  <th className="px-4 py-3 font-medium">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-slate-50">
                    {activeResource.fields.map((field) => (
                      <td key={field.name} className="px-4 py-3 text-slate-700">{record[field.name] || "-"}</td>
                    ))}
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => editRecord(record)}>
                          <Pencil className="h-3.5 w-3.5" />
                          Edit
                        </Button>
                        <Button type="button" variant="destructive" size="sm" onClick={() => deleteRecord(record.id)}>
                          <Trash2 className="h-3.5 w-3.5" />
                          Hapus
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td className="px-4 py-8 text-center text-slate-500" colSpan={activeResource.fields.length + 1}>
                      Data tidak ditemukan.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
