"use strict";(self.webpackChunkasync_storage_website=self.webpackChunkasync_storage_website||[]).push([[476],{876:(e,t,n)=>{n.d(t,{Zo:()=>u,kt:()=>m});var a=n(2784);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function o(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var a=Object.getOwnPropertySymbols(e);t&&(a=a.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,a)}return n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?o(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):o(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function s(e,t){if(null==e)return{};var n,a,r=function(e,t){if(null==e)return{};var n,a,r={},o=Object.keys(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||(r[n]=e[n]);return r}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(a=0;a<o.length;a++)n=o[a],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(r[n]=e[n])}return r}var l=a.createContext({}),c=function(e){var t=a.useContext(l),n=t;return e&&(n="function"==typeof e?e(t):i(i({},t),e)),n},u=function(e){var t=c(e.components);return a.createElement(l.Provider,{value:t},e.children)},d="mdxType",g={inlineCode:"code",wrapper:function(e){var t=e.children;return a.createElement(a.Fragment,{},t)}},p=a.forwardRef((function(e,t){var n=e.components,r=e.mdxType,o=e.originalType,l=e.parentName,u=s(e,["components","mdxType","originalType","parentName"]),d=c(n),p=r,m=d["".concat(l,".").concat(p)]||d[p]||g[p]||o;return n?a.createElement(m,i(i({ref:t},u),{},{components:n})):a.createElement(m,i({ref:t},u))}));function m(e,t){var n=arguments,r=t&&t.mdxType;if("string"==typeof e||r){var o=n.length,i=new Array(o);i[0]=p;var s={};for(var l in t)hasOwnProperty.call(t,l)&&(s[l]=t[l]);s.originalType=e,s[d]="string"==typeof e?e:r,i[1]=s;for(var c=2;c<o;c++)i[c]=n[c];return a.createElement.apply(null,i)}return a.createElement.apply(null,n)}p.displayName="MDXCreateElement"},9401:(e,t,n)=>{n.r(t),n.d(t,{assets:()=>l,contentTitle:()=>i,default:()=>g,frontMatter:()=>o,metadata:()=>s,toc:()=>c});var a=n(7896),r=(n(2784),n(876));const o={id:"usage",title:"Usage",sidebar_label:"Usage"},i=void 0,s={unversionedId:"usage",id:"usage",title:"Usage",description:"Async Storage can only store string data. In order to store object data,",source:"@site/docs/Usage.md",sourceDirName:".",slug:"/usage",permalink:"/async-storage/docs/usage",draft:!1,editUrl:"https://github.com/react-native-async-storage/async-storage/edit/main/website/docs/Usage.md",tags:[],version:"current",frontMatter:{id:"usage",title:"Usage",sidebar_label:"Usage"},sidebar:"docs",previous:{title:"Installation",permalink:"/async-storage/docs/install"},next:{title:"API",permalink:"/async-storage/docs/api"}},l={},c=[{value:"Importing",id:"importing",level:3},{value:"Storing data",id:"storing-data",level:3},{value:"Storing string value",id:"storing-string-value",level:4},{value:"Storing object value",id:"storing-object-value",level:4},{value:"Reading data",id:"reading-data",level:3},{value:"Reading string value",id:"reading-string-value",level:4},{value:"Reading object value",id:"reading-object-value",level:4},{value:"More",id:"more",level:3}],u={toc:c},d="wrapper";function g(e){let{components:t,...n}=e;return(0,r.kt)(d,(0,a.Z)({},u,n,{components:t,mdxType:"MDXLayout"}),(0,r.kt)("p",null,(0,r.kt)("strong",{parentName:"p"},"Async Storage")," can only store ",(0,r.kt)("inlineCode",{parentName:"p"},"string")," data. In order to store object data,\nyou need to serialize it first. For data that can be serialized to JSON, you can\nuse ",(0,r.kt)("inlineCode",{parentName:"p"},"JSON.stringify()")," when saving the data and ",(0,r.kt)("inlineCode",{parentName:"p"},"JSON.parse()")," when loading the\ndata."),(0,r.kt)("h3",{id:"importing"},"Importing"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-js"},"import AsyncStorage from '@react-native-async-storage/async-storage';\n")),(0,r.kt)("h3",{id:"storing-data"},"Storing data"),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"setItem()")," is used both to add new data item (when no data for given key\nexists), and to modify existing item (when previous data for given key exists)."),(0,r.kt)("h4",{id:"storing-string-value"},"Storing string value"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-jsx"},"const storeData = async (value) => {\n  try {\n    await AsyncStorage.setItem('my-key', value);\n  } catch (e) {\n    // saving error\n  }\n};\n")),(0,r.kt)("h4",{id:"storing-object-value"},"Storing object value"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-jsx"},"const storeData = async (value) => {\n  try {\n    const jsonValue = JSON.stringify(value);\n    await AsyncStorage.setItem('my-key', jsonValue);\n  } catch (e) {\n    // saving error\n  }\n};\n")),(0,r.kt)("h3",{id:"reading-data"},"Reading data"),(0,r.kt)("p",null,(0,r.kt)("inlineCode",{parentName:"p"},"getItem")," returns a promise that either resolves to stored value when data is\nfound for given key, or returns ",(0,r.kt)("inlineCode",{parentName:"p"},"null")," otherwise."),(0,r.kt)("h4",{id:"reading-string-value"},"Reading string value"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-jsx"},"const getData = async () => {\n  try {\n    const value = await AsyncStorage.getItem('my-key');\n    if (value !== null) {\n      // value previously stored\n    }\n  } catch (e) {\n    // error reading value\n  }\n};\n")),(0,r.kt)("h4",{id:"reading-object-value"},"Reading object value"),(0,r.kt)("pre",null,(0,r.kt)("code",{parentName:"pre",className:"language-jsx"},"const getData = async () => {\n  try {\n    const jsonValue = await AsyncStorage.getItem('my-key');\n    return jsonValue != null ? JSON.parse(jsonValue) : null;\n  } catch (e) {\n    // error reading value\n  }\n};\n")),(0,r.kt)("h3",{id:"more"},"More"),(0,r.kt)("p",null,"For more examples, ",(0,r.kt)("a",{parentName:"p",href:"/async-storage/docs/api"},"head over to API section.")))}g.isMDXComponent=!0}}]);