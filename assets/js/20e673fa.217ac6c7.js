"use strict";(self.webpackChunkasync_storage_website=self.webpackChunkasync_storage_website||[]).push([[760],{876:(e,t,r)=>{r.d(t,{Zo:()=>d,kt:()=>f});var n=r(2784);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function i(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function o(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?i(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):i(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var c=n.createContext({}),l=function(e){var t=n.useContext(c),r=t;return e&&(r="function"==typeof e?e(t):o(o({},t),e)),r},d=function(e){var t=l(e.components);return n.createElement(c.Provider,{value:t},e.children)},p="mdxType",m={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},u=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,i=e.originalType,c=e.parentName,d=s(e,["components","mdxType","originalType","parentName"]),p=l(r),u=a,f=p["".concat(c,".").concat(u)]||p[u]||m[u]||i;return r?n.createElement(f,o(o({ref:t},d),{},{components:r})):n.createElement(f,o({ref:t},d))}));function f(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var i=r.length,o=new Array(i);o[0]=u;var s={};for(var c in t)hasOwnProperty.call(t,c)&&(s[c]=t[c]);s.originalType=e,s[p]="string"==typeof e?e:a,o[1]=s;for(var l=2;l<i;l++)o[l]=r[l];return n.createElement.apply(null,o)}return n.createElement.apply(null,r)}u.displayName="MDXCreateElement"},3707:(e,t,r)=>{r.d(t,{Z:()=>a});var n=r(2784);const a=e=>{let{platformIcon:t,title:r}=e;return n.createElement("div",{style:{display:"flex",margin:"10px 20px",alignItems:"center",flexDirection:"row"}},n.createElement("img",{style:{width:34,height:34},src:"/async-storage/img/"+t}),n.createElement("p",{style:{margin:"0 0 0 10px",padding:0}},r))}},2598:(e,t,r)=>{r.r(t),r.d(t,{assets:()=>l,contentTitle:()=>s,default:()=>u,frontMatter:()=>o,metadata:()=>c,toc:()=>d});var n=r(7896),a=(r(2784),r(876)),i=r(3707);const o={id:"db_size",title:"Increasing Storage size",sidebar_label:"Storage space increase"},s=void 0,c={unversionedId:"advanced/db_size",id:"advanced/db_size",title:"Increasing Storage size",description:"Supported platforms:",source:"@site/docs/advanced/IncreaseDbSize.md",sourceDirName:"advanced",slug:"/advanced/db_size",permalink:"/async-storage/docs/advanced/db_size",draft:!1,editUrl:"https://github.com/react-native-async-storage/async-storage/edit/main/website/docs/advanced/IncreaseDbSize.md",tags:[],version:"current",frontMatter:{id:"db_size",title:"Increasing Storage size",sidebar_label:"Storage space increase"},sidebar:"docs",previous:{title:"Dedicated Executor",permalink:"/async-storage/docs/advanced/executor"},next:{title:"Where data is stored",permalink:"/async-storage/docs/advanced/where_data_stored"}},l={},d=[{value:"Motivation",id:"motivation",level:2},{value:"Increase limit",id:"increase-limit",level:2}],p={toc:d},m="wrapper";function u(e){let{components:t,...r}=e;return(0,a.kt)(m,(0,n.Z)({},p,r,{components:t,mdxType:"MDXLayout"}),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"Supported platforms:")),(0,a.kt)(i.Z,{title:"Android",platformIcon:"icon_android.svg",mdxType:"PlatformSupport"}),(0,a.kt)("hr",null),(0,a.kt)("p",null,(0,a.kt)("strong",{parentName:"p"},"Note"),": This feature is obsolete when ",(0,a.kt)("a",{parentName:"p",href:"/async-storage/docs/advanced/next"},"Next storage feature is enabled"),"."),(0,a.kt)("h2",{id:"motivation"},"Motivation"),(0,a.kt)("p",null,"Current Async Storage's size is set to 6MB. Going over this limit causes ",(0,a.kt)("inlineCode",{parentName:"p"},"database or disk is full")," error. This 6MB limit is a sane limit to protect the user from the app storing too much data in the database. This also protects the database from filling up the disk cache and becoming malformed (endTransaction() calls will throw an exception, not rollback, and leave the db malformed). You have to be aware of that risk when increasing the database size. We recommend to ensure that your app does not write more data to AsyncStorage than space is left on disk. Since AsyncStorage is based on SQLite on Android you also have to be aware of the ",(0,a.kt)("a",{parentName:"p",href:"https://www.sqlite.org/limits.html"},"SQLite limits"),"."),(0,a.kt)("h2",{id:"increase-limit"},"Increase limit"),(0,a.kt)("p",null,"Add a ",(0,a.kt)("inlineCode",{parentName:"p"},"AsyncStorage_db_size_in_MB")," property to your ",(0,a.kt)("inlineCode",{parentName:"p"},"android/gradle.properties"),":"),(0,a.kt)("pre",null,(0,a.kt)("code",{parentName:"pre",className:"language-bash"},"AsyncStorage_db_size_in_MB=10\n")),(0,a.kt)("p",null,"Now you can define the new size in MB. In this example, the new limit is 10 MB."))}u.isMDXComponent=!0}}]);