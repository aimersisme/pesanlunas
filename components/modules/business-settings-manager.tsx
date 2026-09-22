"use client";
import{useEffect,useMemo,useState}from"react";
import{createClient}from"@/lib/supabase/browser";
import{FormActions,ModuleHeader,Notice}from"@/components/crud-ui";

type F={name:string;address:string;whatsapp:string;email:string;timezone:string;currency:string;invoice_prefix:string;order_prefix:string;sku_prefix:string};
const empty:F={name:"",address:"",whatsapp:"",email:"",timezone:"Asia/Jakarta",currency:"IDR",invoice_prefix:"INV",order_prefix:"ORD",sku_prefix:"SKU"};
const cleanPrefix=(value:string,fallback:string)=>value.toUpperCase().replace(/[^A-Z0-9_-]/g,"").slice(0,12)||fallback;

export function BusinessSettingsManager({businessId,role}:{businessId:string;role:string}){
  const supabase=useMemo(()=>createClient(),[]);const[form,setForm]=useState<F>(empty);const[provider,setProvider]=useState("manual");const[autoReminder,setAutoReminder]=useState(false);const[saving,setSaving]=useState(false);const[msg,setMsg]=useState<{kind:"success"|"error";text:string}|null>(null);const canOwner=role==="owner";

  useEffect(()=>{void(async()=>{
    const[{data:b},{data:s}]=await Promise.all([
      supabase.from("businesses").select("name,address,whatsapp,email,timezone,currency,invoice_prefix,order_prefix,sku_prefix").eq("id",businessId).single(),
      supabase.from("business_settings").select("key,value").eq("business_id",businessId).in("key",["whatsapp_provider","auto_reminder"])
    ]);
    if(b)setForm({name:b.name,address:b.address??"",whatsapp:b.whatsapp??"",email:b.email??"",timezone:b.timezone??"Asia/Jakarta",currency:b.currency??"IDR",invoice_prefix:b.invoice_prefix??"INV",order_prefix:b.order_prefix??"ORD",sku_prefix:b.sku_prefix??"SKU"});
    for(const row of s??[]){if(row.key==="whatsapp_provider")setProvider(String((row.value as Record<string,unknown>)?.provider??"manual"));if(row.key==="auto_reminder")setAutoReminder(Boolean((row.value as Record<string,unknown>)?.enabled))}
  })()},[businessId,supabase]);

  async function save(e:React.FormEvent){
    e.preventDefault();if(!canOwner)return setMsg({kind:"error",text:"Hanya owner yang dapat mengubah pengaturan usaha."});setSaving(true);
    const skuPrefix=cleanPrefix(form.sku_prefix,"SKU");
    const{error}=await supabase.from("businesses").update({...form,name:form.name.trim(),address:form.address.trim()||null,whatsapp:form.whatsapp.trim()||null,email:form.email.trim()||null,invoice_prefix:cleanPrefix(form.invoice_prefix,"INV"),order_prefix:cleanPrefix(form.order_prefix,"ORD"),sku_prefix:skuPrefix}).eq("id",businessId);
    if(!error){await supabase.from("business_settings").upsert([{business_id:businessId,key:"whatsapp_provider",value:{provider}},{business_id:businessId,key:"auto_reminder",value:{enabled:autoReminder}}],{onConflict:"business_id,key"})}
    setSaving(false);if(error)return setMsg({kind:"error",text:error.message});setForm(v=>({...v,sku_prefix:skuPrefix}));setMsg({kind:"success",text:"Pengaturan usaha tersimpan."})
  }

  return <>
    <ModuleHeader title="Pengaturan Usaha" subtitle="Profil, kode otomatis, nomor dokumen, dan preferensi integrasi"/>
    {msg?<Notice kind={msg.kind}>{msg.text}</Notice>:null}
    <form className="formPanel" onSubmit={save}>
      <h2>Profil Usaha</h2>
      <div className="fieldGrid">
        <label className="formField full">Nama Usaha<input value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label>
        <label className="formField full">Alamat<textarea value={form.address} onChange={e=>setForm({...form,address:e.target.value})}/></label>
        <label className="formField">WhatsApp<input value={form.whatsapp} onChange={e=>setForm({...form,whatsapp:e.target.value})}/></label>
        <label className="formField">Email<input value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label>
      </div>
      <h2 style={{marginTop:20}}>Kode Otomatis</h2>
      <div className="fieldGrid">
        <label className="formField">Prefix SKU Produk/Jasa<input maxLength={12} value={form.sku_prefix} onChange={e=>setForm({...form,sku_prefix:cleanPrefix(e.target.value,"")})} placeholder="SKU"/><span className="formHint">Contoh hasil: {cleanPrefix(form.sku_prefix,"SKU")}-000001. Nomor dibuat otomatis dan aman dari duplikat.</span></label>
        <label className="formField">Prefix Order<input value={form.order_prefix} onChange={e=>setForm({...form,order_prefix:e.target.value})}/></label>
        <label className="formField">Prefix Invoice<input value={form.invoice_prefix} onChange={e=>setForm({...form,invoice_prefix:e.target.value})}/></label>
        <label className="formField">Timezone<input value={form.timezone} onChange={e=>setForm({...form,timezone:e.target.value})}/></label>
        <label className="formField">Currency<input value={form.currency} onChange={e=>setForm({...form,currency:e.target.value})}/></label>
      </div>
      <h2 style={{marginTop:20}}>WhatsApp</h2>
      <div className="fieldGrid"><label className="formField">Provider<select value={provider} onChange={e=>setProvider(e.target.value)}><option value="manual">Manual wa.me</option><option value="fonnte">Fonnte</option><option value="starsender">Starsender</option></select><span className="formHint">Token provider tetap disimpan server-side, bukan di database.</span></label><label className="checkboxField"><input type="checkbox" checked={autoReminder} onChange={e=>setAutoReminder(e.target.checked)}/>Aktifkan reminder otomatis</label></div>
      <FormActions saving={saving} submitLabel="Simpan Pengaturan"/>
    </form>
    {!canOwner?<Notice kind="info">Role Anda hanya dapat melihat pengaturan. Perubahan profil usaha khusus owner.</Notice>:null}
  </>
}
