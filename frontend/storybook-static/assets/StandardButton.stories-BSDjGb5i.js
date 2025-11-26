import{j as a}from"./jsx-runtime-DF2Pcvd1.js";import{S as r}from"./StandardButton-CScRPqeV.js";import{R as $,a as C}from"./EditOutlined-De-XwOjx.js";import{_ as F}from"./index-CoYV9DD8.js";import{r as l}from"./index-B2-qRKKC.js";import{I as H}from"./button-CnKokCYq.js";import"./_commonjsHelpers-Cpj98o6Y.js";import"./index-Di9W7h6v.js";var G={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M360 184h-8c4.4 0 8-3.6 8-8v8h304v-8c0 4.4 3.6 8 8 8h-8v72h72v-80c0-35.3-28.7-64-64-64H352c-35.3 0-64 28.7-64 64v80h72v-72zm504 72H160c-17.7 0-32 14.3-32 32v32c0 4.4 3.6 8 8 8h60.4l24.7 523c1.6 34.1 29.8 61 63.9 61h454c34.2 0 62.3-26.8 63.9-61l24.7-523H888c4.4 0 8-3.6 8-8v-32c0-17.7-14.3-32-32-32zM731.3 840H292.7l-24.2-512h487l-24.2 512z"}}]},name:"delete",theme:"outlined"},T=function(p,u){return l.createElement(H,F({},p,{ref:u,icon:G}))},M=l.forwardRef(T),U={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M893.3 293.3L730.7 130.7c-7.5-7.5-16.7-13-26.7-16V112H144c-17.7 0-32 14.3-32 32v736c0 17.7 14.3 32 32 32h736c17.7 0 32-14.3 32-32V338.5c0-17-6.7-33.2-18.7-45.2zM384 184h256v104H384V184zm456 656H184V184h136v136c0 17.7 14.3 32 32 32h320c17.7 0 32-14.3 32-32V205.8l136 136V840zM512 442c-79.5 0-144 64.5-144 144s64.5 144 144 144 144-64.5 144-144-64.5-144-144-144zm0 224c-44.2 0-80-35.8-80-80s35.8-80 80-80 80 35.8 80 80-35.8 80-80 80z"}}]},name:"save",theme:"outlined"},q=function(p,u){return l.createElement(H,F({},p,{ref:u,icon:U}))},m=l.forwardRef(q);const ta={title:"UI Components/Buttons/StandardButton",component:r,parameters:{docs:{description:{component:"Standardized button component that extends Ant Design Button with consistent styling and icon mapping."}}},argTypes:{variant:{control:{type:"select"},options:["primary","secondary","success","warning","danger","ghost","link"],description:"Button variant style"},size:{control:{type:"select"},options:["small","medium","large"],description:"Button size"},loading:{control:{type:"boolean"},description:"Loading state"},disabled:{control:{type:"boolean"},description:"Disabled state"},block:{control:{type:"boolean"},description:"Full width button"},children:{control:{type:"text"},description:"Button content"}}},o={args:{children:"Default Button",variant:"primary",size:"medium"}},t=()=>a.jsxs("div",{style:{display:"flex",gap:"12px",flexWrap:"wrap"},children:[a.jsx(r,{variant:"primary",children:"Primary"}),a.jsx(r,{variant:"secondary",children:"Secondary"}),a.jsx(r,{variant:"success",children:"Success"}),a.jsx(r,{variant:"warning",children:"Warning"}),a.jsx(r,{variant:"danger",children:"Danger"}),a.jsx(r,{variant:"ghost",children:"Ghost"}),a.jsx(r,{variant:"link",children:"Link"})]}),e=()=>a.jsxs("div",{style:{display:"flex",gap:"12px",alignItems:"center"},children:[a.jsx(r,{size:"small",children:"Small"}),a.jsx(r,{size:"medium",children:"Medium"}),a.jsx(r,{size:"large",children:"Large"})]}),n=()=>a.jsxs("div",{style:{display:"flex",gap:"12px",flexWrap:"wrap"},children:[a.jsx(r,{variant:"primary",icon:a.jsx($,{}),children:"Add Item"}),a.jsx(r,{variant:"secondary",icon:a.jsx(C,{}),children:"Edit"}),a.jsx(r,{variant:"danger",icon:a.jsx(M,{}),children:"Delete"}),a.jsx(r,{variant:"success",icon:a.jsx(m,{}),children:"Save"})]}),i=()=>a.jsxs("div",{style:{display:"flex",gap:"12px",flexWrap:"wrap"},children:[a.jsx(r,{variant:"primary",loading:!0,children:"Loading Primary"}),a.jsx(r,{variant:"secondary",loading:!0,children:"Loading Secondary"}),a.jsx(r,{variant:"success",loading:!0,icon:a.jsx(m,{}),children:"Saving..."})]}),d=()=>a.jsxs("div",{style:{display:"flex",gap:"12px",flexWrap:"wrap"},children:[a.jsx(r,{variant:"primary",disabled:!0,children:"Disabled Primary"}),a.jsx(r,{variant:"secondary",disabled:!0,children:"Disabled Secondary"}),a.jsx(r,{variant:"danger",disabled:!0,icon:a.jsx(M,{}),children:"Disabled with Icon"})]}),s=()=>a.jsxs("div",{style:{display:"flex",flexDirection:"column",gap:"12px",maxWidth:"300px"},children:[a.jsx(r,{variant:"primary",block:!0,children:"Full Width Primary"}),a.jsx(r,{variant:"secondary",block:!0,children:"Full Width Secondary"}),a.jsx(r,{variant:"success",block:!0,icon:a.jsx(m,{}),children:"Full Width with Icon"})]}),c={args:{children:"Click me!",variant:"primary",size:"medium",loading:!1,disabled:!1,block:!1},parameters:{docs:{description:{story:"Interactive example where you can test different props combinations."}}}};t.__docgenInfo={description:"",methods:[],displayName:"AllVariants"};e.__docgenInfo={description:"",methods:[],displayName:"AllSizes"};n.__docgenInfo={description:"",methods:[],displayName:"WithIcons"};i.__docgenInfo={description:"",methods:[],displayName:"LoadingStates"};d.__docgenInfo={description:"",methods:[],displayName:"DisabledStates"};s.__docgenInfo={description:"",methods:[],displayName:"BlockButtons"};var v,S,x;o.parameters={...o.parameters,docs:{...(v=o.parameters)==null?void 0:v.docs,source:{originalSource:`{
  args: {
    children: 'Default Button',
    variant: 'primary',
    size: 'medium'
  }
}`,...(x=(S=o.parameters)==null?void 0:S.docs)==null?void 0:x.source}}};var y,g,h;t.parameters={...t.parameters,docs:{...(y=t.parameters)==null?void 0:y.docs,source:{originalSource:`() => <div style={{
  display: 'flex',
  gap: '12px',
  flexWrap: 'wrap'
}}>\r
    <StandardButton variant="primary">Primary</StandardButton>\r
    <StandardButton variant="secondary">Secondary</StandardButton>\r
    <StandardButton variant="success">Success</StandardButton>\r
    <StandardButton variant="warning">Warning</StandardButton>\r
    <StandardButton variant="danger">Danger</StandardButton>\r
    <StandardButton variant="ghost">Ghost</StandardButton>\r
    <StandardButton variant="link">Link</StandardButton>\r
  </div>`,...(h=(g=t.parameters)==null?void 0:g.docs)==null?void 0:h.source}}};var B,f,j;e.parameters={...e.parameters,docs:{...(B=e.parameters)==null?void 0:B.docs,source:{originalSource:`() => <div style={{
  display: 'flex',
  gap: '12px',
  alignItems: 'center'
}}>\r
    <StandardButton size="small">Small</StandardButton>\r
    <StandardButton size="medium">Medium</StandardButton>\r
    <StandardButton size="large">Large</StandardButton>\r
  </div>`,...(j=(f=e.parameters)==null?void 0:f.docs)==null?void 0:j.source}}};var b,I,D;n.parameters={...n.parameters,docs:{...(b=n.parameters)==null?void 0:b.docs,source:{originalSource:`() => <div style={{
  display: 'flex',
  gap: '12px',
  flexWrap: 'wrap'
}}>\r
    <StandardButton variant="primary" icon={<PlusOutlined />}>\r
      Add Item\r
    </StandardButton>\r
    <StandardButton variant="secondary" icon={<EditOutlined />}>\r
      Edit\r
    </StandardButton>\r
    <StandardButton variant="danger" icon={<DeleteOutlined />}>\r
      Delete\r
    </StandardButton>\r
    <StandardButton variant="success" icon={<SaveOutlined />}>\r
      Save\r
    </StandardButton>\r
  </div>`,...(D=(I=n.parameters)==null?void 0:I.docs)==null?void 0:D.source}}};var z,w,W;i.parameters={...i.parameters,docs:{...(z=i.parameters)==null?void 0:z.docs,source:{originalSource:`() => <div style={{
  display: 'flex',
  gap: '12px',
  flexWrap: 'wrap'
}}>\r
    <StandardButton variant="primary" loading>\r
      Loading Primary\r
    </StandardButton>\r
    <StandardButton variant="secondary" loading>\r
      Loading Secondary\r
    </StandardButton>\r
    <StandardButton variant="success" loading icon={<SaveOutlined />}>\r
      Saving...\r
    </StandardButton>\r
  </div>`,...(W=(w=i.parameters)==null?void 0:w.docs)==null?void 0:W.source}}};var k,_,O;d.parameters={...d.parameters,docs:{...(k=d.parameters)==null?void 0:k.docs,source:{originalSource:`() => <div style={{
  display: 'flex',
  gap: '12px',
  flexWrap: 'wrap'
}}>\r
    <StandardButton variant="primary" disabled>\r
      Disabled Primary\r
    </StandardButton>\r
    <StandardButton variant="secondary" disabled>\r
      Disabled Secondary\r
    </StandardButton>\r
    <StandardButton variant="danger" disabled icon={<DeleteOutlined />}>\r
      Disabled with Icon\r
    </StandardButton>\r
  </div>`,...(O=(_=d.parameters)==null?void 0:_.docs)==null?void 0:O.source}}};var L,A,P;s.parameters={...s.parameters,docs:{...(L=s.parameters)==null?void 0:L.docs,source:{originalSource:`() => <div style={{
  display: 'flex',
  flexDirection: 'column',
  gap: '12px',
  maxWidth: '300px'
}}>\r
    <StandardButton variant="primary" block>\r
      Full Width Primary\r
    </StandardButton>\r
    <StandardButton variant="secondary" block>\r
      Full Width Secondary\r
    </StandardButton>\r
    <StandardButton variant="success" block icon={<SaveOutlined />}>\r
      Full Width with Icon\r
    </StandardButton>\r
  </div>`,...(P=(A=s.parameters)==null?void 0:A.docs)==null?void 0:P.source}}};var V,E,R;c.parameters={...c.parameters,docs:{...(V=c.parameters)==null?void 0:V.docs,source:{originalSource:`{
  args: {
    children: 'Click me!',
    variant: 'primary',
    size: 'medium',
    loading: false,
    disabled: false,
    block: false
  },
  parameters: {
    docs: {
      description: {
        story: 'Interactive example where you can test different props combinations.'
      }
    }
  }
}`,...(R=(E=c.parameters)==null?void 0:E.docs)==null?void 0:R.source}}};const ea=["Default","AllVariants","AllSizes","WithIcons","LoadingStates","DisabledStates","BlockButtons","Interactive"];export{e as AllSizes,t as AllVariants,s as BlockButtons,o as Default,d as DisabledStates,c as Interactive,i as LoadingStates,n as WithIcons,ea as __namedExportsOrder,ta as default};
