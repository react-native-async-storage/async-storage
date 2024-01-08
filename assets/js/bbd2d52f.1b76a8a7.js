"use strict";(self.webpackChunkasync_storage_website=self.webpackChunkasync_storage_website||[]).push([[647],{876:(e,t,n)=>{n.d(t,{Zo:()=>s,kt:()=>m});var r=n(2784);function a(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,r)}return n}function c(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){a(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function i(e,t){if(null==e)return{};var n,r,a=function(e,t){if(null==e)return{};var n,r,a={},o=Object.keys(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(r=0;r<o.length;r++)n=o[r],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var l=r.createContext({}),p=function(e){var t=r.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):c(c({},t),e)),n},s=function(e){var t=p(e.components);return r.createElement(l.Provider,{value:t},e.children)},u="mdxType",d={inlineCode:"code",wrapper:function(e){var t=e.children;return r.createElement(r.Fragment,{},t)}},f=r.forwardRef((function(e,t){var n=e.components,a=e.mdxType,o=e.originalType,l=e.parentName,s=i(e,["components","mdxType","originalType","parentName"]),u=p(n),f=a,m=u["".concat(l,".").concat(f)]||u[f]||d[f]||o;return n?r.createElement(m,c(c({ref:t},s),{},{components:n})):r.createElement(m,c({ref:t},s))}));function m(e,t){var n=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=n.length,c=new Array(o);c[0]=f;var i={};for(var l in t)hasOwnProperty.call(t,l)&&(i[l]=t[l]);i.originalType=e,i[u]="string"==typeof e?e:a,c[1]=i;for(var p=2;p<o;p++)c[p]=n[p];return r.createElement.apply(null,c)}return r.createElement.apply(null,n)}f.displayName="MDXCreateElement"},3707:(e,t,n)=>{n.d(t,{Z:()=>a});var r=n(2784);const a=e=>{let{platformIcon:t,title:n}=e;return r.createElement("div",{style:{display:"flex",margin:"10px 20px",alignItems:"center",flexDirection:"row"}},r.createElement("img",{style:{width:34,height:34},src:"/async-storage/img/"+t}),r.createElement("p",{style:{margin:"0 0 0 10px",padding:0}},n))}},9353:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>p,contentTitle:()=>i,default:()=>f,frontMatter:()=>c,metadata:()=>l,toc:()=>s});var r=n(7896),a=(n(2784),n(876)),o=n(3707);const c={id:"backup",title:"Database backup exclusion",sidebar_label:"iCloud backup"},i=void 0,l={unversionedId:"advanced/backup",id:"advanced/backup",title:"Database backup exclusion",description:"Supported platforms:",source:"@site/docs/advanced/Backup.md",sourceDirName:"advanced",slug:"/advanced/backup",permalink:"/async-storage/docs/advanced/backup",draft:!1,editUrl:"https://github.com/react-native-async-storage/async-storage/edit/main/website/docs/advanced/Backup.md",tags:[],version:"current",frontMatter:{id:"backup",title:"Database backup exclusion",sidebar_label:"iCloud backup"},sidebar:"docs",previous:{title:"Brownfield integration",permalink:"/async-storage/docs/advanced/brownfield"},next:{title:"Dedicated Executor",permalink:"/async-storage/docs/advanced/executor"}},p={},s=[],u={toc:s},d="wrapper";function f(e){let{components:t,...n}=e;return(0,a.kt)(d,(0,r.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"Supported platforms:")),(0,a.kt)(o.Z,{title:"iOS/MacOS",platformIcon:"icon_ios.svg",mdxType:"PlatformSupport"}),(0,a.kt)("hr",null),(0,a.kt)("p",null,"Async Storage stores data in ",(0,a.kt)("inlineCode",{parentName:"p"},"Application Support")," directory, which is backed up by iCloud by default.",(0,a.kt)("br",{parentName:"p"}),"\n","This can lead to unintentional behavior where data is persisted even after an app re-installation."),(0,a.kt)("p",null,"Async Storage disables that feature by default. "),(0,a.kt)("p",null,"In order to enable iCloud backup, open your app's ",(0,a.kt)("inlineCode",{parentName:"p"},"info.plist")," in Xcode and add ",(0,a.kt)("strong",{parentName:"p"},"boolean")," entry called ",(0,a.kt)("strong",{parentName:"p"},"RCTAsyncStorageExcludeFromBackup")," and set its value to ",(0,a.kt)("strong",{parentName:"p"},"NO")," (NO as no for exclusion)."),(0,a.kt)("p",null,"Alternatively, you can open ",(0,a.kt)("inlineCode",{parentName:"p"},"info.plist")," in editor and add new entry: "),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-diff"},"+   <key>RCTAsyncStorageExcludeFromBackup</key>\n+   <false/>\n")))}f.isMDXComponent=!0}}]);