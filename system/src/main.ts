import { enableProdMode } from "@angular/core";
import { environment } from "./envirments/environment";

import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";
import { AppModule } from "./app/app.module";

if(environment.production){
  enableProdMode();
}
//建立要準備執行 Angular 應用程式的平台
platformBrowserDynamic().bootstrapModule(AppModule).catch(
  err => console.log(err)
)