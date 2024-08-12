========================================================================
The Microsoft.Windows.CppWinRT NuGet package automatically generates C++/WinRT projection headers, 
enabling you to both consume and produce Windows Runtime classes.
========================================================================

C++/WinRT detects Windows metadata referenced by the project, from:
* Platform winmd files in the SDK (both MSI and NuGet)
* NuGet packages containing winmd files
* Other projects producing winmd files
* Raw winmd files
* Interface definition language (IDL) files in the project 

For any winmd file referenced by the project, C++/WinRT creates reference (consuming) projection headers.  
Client code can simply #include these headers, which are created in the Generated Files directory.

For any IDL file contained in the project, C++/WinRT creates component (producing) projection headers.  
In addition, C++/WinRT generates templates and skeleton implementations for each runtime class, under the Generated Files directory.
  
========================================================================
For more information, visit:
https://github.com/Microsoft/cppwinrt/tree/master/nuget
========================================================================
