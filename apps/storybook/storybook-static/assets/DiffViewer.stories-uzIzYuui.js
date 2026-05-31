import{i as e}from"./preload-helper-xPQekRTU.js";import{t}from"./jsx-runtime-CaZkqeYb.js";import{Ki as n,t as r}from"./src-DgoylXRw.js";var i,a,o,s,c,l,u,d,f,p;e((()=>{r(),i=t(),a=[{header:`@@ -18,6 +18,14 @@ export class PaymentService {`,lines:[{type:`ctx`,old:18,new:18,code:`  async processPayment(dto: PaymentDto): Promise<Payment> {`},{type:`ctx`,old:19,new:19,code:`    const validated = await this.validator.validate(dto);`},{type:`ctx`,old:20,new:20,code:`    if (!validated) throw new BadRequestException();`},{type:`add`,old:null,new:21,code:``},{type:`add`,old:null,new:22,code:`    const idempotencyKey = dto.idempotencyKey;`},{type:`add`,old:null,new:23,code:`    const cached = await this.cache.get(idempotencyKey);`},{type:`add`,old:null,new:24,code:`    if (cached) {`},{type:`add`,old:null,new:25,code:"      this.logger.debug(`Idempotency hit: ${idempotencyKey}`);"},{type:`add`,old:null,new:26,code:`      return cached;`},{type:`add`,old:null,new:27,code:`    }`},{type:`add`,old:null,new:28,code:``},{type:`ctx`,old:21,new:29,code:`    const payment = await this.ledger.create(validated);`},{type:`ctx`,old:22,new:30,code:`    await this.events.emit("payment.created", payment);`},{type:`ctx`,old:23,new:31,code:`    return payment;`}]},{header:`@@ -42,7 +50,9 @@ export class PaymentService {`,lines:[{type:`ctx`,old:42,new:50,code:`  }`},{type:`ctx`,old:43,new:51,code:``},{type:`ctx`,old:44,new:52,code:`  async retryPayment(id: string): Promise<Payment> {`},{type:`del`,old:45,new:null,code:`    return this.ledger.retry(id);`},{type:`add`,old:null,new:53,code:"    const key = `retry:${id}`;"},{type:`add`,old:null,new:54,code:`    await this.cache.set(key, id, { ttl: 300 });`},{type:`add`,old:null,new:55,code:`    return this.ledger.retry(id);`},{type:`ctx`,old:46,new:56,code:`  }`}]}],o=[{path:`src/payment/payment.service.ts`,additions:10,deletions:1,hunks:a},{path:`src/payment/payment.dto.ts`,additions:3,deletions:0,hunks:[{header:`@@ -8,4 +8,7 @@ export class PaymentDto {`,lines:[{type:`ctx`,old:8,new:8,code:`  @IsString()`},{type:`ctx`,old:9,new:9,code:`  description: string;`},{type:`ctx`,old:10,new:10,code:``},{type:`add`,old:null,new:11,code:`  @IsUUID()`},{type:`add`,old:null,new:12,code:`  @IsOptional()`},{type:`add`,old:null,new:13,code:`  idempotencyKey?: string;`}]}]}],s={title:`Elements/DiffViewer`,component:n,tags:[`autodocs`],parameters:{layout:`padded`,docs:{description:{component:"A code diff renderer in the style of Linear / Stripe: per-file headers with +/− counts, hunk anchors, and color-coded add/del/context lines. Two variants: `unified` (single-column) and `split` (side-by-side). Pass `files` for multi-file views or `hunks` as a single-file shorthand."}}},args:{files:o,variant:`unified`,wrap:!1},argTypes:{variant:{control:`inline-radio`,options:[`unified`,`split`]},wrap:{control:`boolean`}}},c={},l={args:{variant:`split`}},u={args:{files:void 0,hunks:a,variant:`unified`}},d={args:{wrap:!0}},f={render:()=>(0,i.jsxs)(`div`,{style:{maxWidth:820},children:[(0,i.jsx)(`p`,{style:{fontSize:11,fontFamily:`var(--font-mono)`,color:`var(--fg-muted)`,marginBottom:10},children:`PR #7421 · pix-router · +10 −1 across 2 files`}),(0,i.jsx)(n,{files:o,variant:`unified`})]})},c.parameters={...c.parameters,docs:{...c.parameters?.docs,source:{originalSource:`{}`,...c.parameters?.docs?.source},description:{story:`Unified diff — single-column with +/− markers.`,...c.parameters?.docs?.description}}},l.parameters={...l.parameters,docs:{...l.parameters?.docs,source:{originalSource:`{
  args: {
    variant: 'split'
  }
}`,...l.parameters?.docs?.source},description:{story:`Side-by-side split diff.`,...l.parameters?.docs?.description}}},u.parameters={...u.parameters,docs:{...u.parameters?.docs,source:{originalSource:`{
  args: {
    files: undefined,
    hunks: HUNKS_PIX,
    variant: 'unified'
  }
}`,...u.parameters?.docs?.source},description:{story:"Single-file shorthand via the `hunks` prop.",...u.parameters?.docs?.description}}},d.parameters={...d.parameters,docs:{...d.parameters?.docs,source:{originalSource:`{
  args: {
    wrap: true
  }
}`,...d.parameters?.docs?.source},description:{story:`Wrapped lines — no horizontal scroll.`,...d.parameters?.docs?.description}}},f.parameters={...f.parameters,docs:{...f.parameters?.docs,source:{originalSource:`{
  render: () => <div style={{
    maxWidth: 820
  }}>
      <p style={{
      fontSize: 11,
      fontFamily: 'var(--font-mono)',
      color: 'var(--fg-muted)',
      marginBottom: 10
    }}>
        PR #7421 · pix-router · +10 −1 across 2 files
      </p>
      <DiffViewer files={DIFF_FILES} variant="unified" />
    </div>
}`,...f.parameters?.docs?.source},description:{story:`Multi-file PR diff as it appears in the risk-review panel.`,...f.parameters?.docs?.description}}},p=[`Default`,`Split`,`SingleFile`,`Wrapped`,`InContext`]}))();export{c as Default,f as InContext,u as SingleFile,l as Split,d as Wrapped,p as __namedExportsOrder,s as default};