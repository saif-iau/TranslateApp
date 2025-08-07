import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateService } from './services/translate.service';
import { LANGUAGES } from './services/lang-list';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SplashComponent } from "./components/splash/splash.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, ReactiveFormsModule, SplashComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'translateApp';
  imageUrl = 'assets/hero_img.jpg';
  languages = LANGUAGES;
  toaster = inject(ToastrService)
  originalText = new FormControl<string | null>(null, Validators.max(500))
  translatedText = new FormControl<string | null>(null)

  sourceLang = new FormControl('en');
  targetLang = new FormControl('ar');
  splash = signal<boolean>(true)

  constructor(private translateService: TranslateService) { }

  ngOnInit(): void {
       setTimeout(() => {
      this.splash.set(false);
    }, 2000); // hide after 2s
  
    const text = 'Hello, how are you?';
    this.originalText.patchValue(text);



    this.translateService.translate(text, 'en', 'ar')
      .subscribe(translated => {
        this.translatedText.patchValue(translated);
      });



  }

  selectedSourceLangCode: string | null = null;
  selectedTargetLangCode: string = 'en'; // default

  onLangCardClick(langCode: string, type: 'source' | 'target') {
    if (type === 'source') {
      this.sourceLang.setValue(langCode);
      this.selectedSourceLangCode = langCode;
    } else {
      this.targetLang.setValue(langCode);
      this.selectedTargetLangCode = langCode;
    }
  }

  translateText() {

    const from = this.sourceLang.value || 'en';
    const to = this.targetLang.value || 'ar';
    const text = this.originalText.value



    if (text) {

      this.translateService.translate(text, from, to).subscribe(result => {
        console.log(result);

        this.translatedText.patchValue(result);
      });
    }
  }

  setLangByCard(mode: string, lang: string) {
    console.log(mode, lang);

    if (mode === 'source') {
      this.sourceLang.patchValue(lang)
    }
    else {
      this.targetLang.patchValue(lang)

    }
  }


  switchLangs() {
    const tempLang = this.sourceLang.value;
    this.sourceLang.setValue(this.targetLang.value);
    this.targetLang.setValue(tempLang)
    //
    const tempText = this.originalText.value;
    this.originalText.setValue(this.translatedText.value)
    this.translatedText.setValue(tempText)

  }

  // In your .ts file
  speak(source: boolean) {
    let text = ""
    let lang = 'en'

    if (source) {
      text = this.originalText.value!;
      lang = this.sourceLang.value!
    }
    else {
      text = this.translatedText.value!;
      lang = this.targetLang.value!


    }
    if (!text) return;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang
    utterance.rate = 1;   // Speed (0.1 to 10)
    utterance.pitch = 1;  // Voice pitch
    utterance.volume = 1; // Volume (0 to 1)

    speechSynthesis.cancel(); // Stop any current speech
    this.toaster.show("Text To Speech Started!")
    speechSynthesis.speak(utterance);
  }


  copyText(source: boolean) {
    let text = ""


    if (source) {
      text = this.originalText.value!;

    }
    else {
      text = this.translatedText.value!;



    }
    if (!navigator.clipboard) {
      console.error('Clipboard API not supported');
      return;
    }

    navigator.clipboard.writeText(text).then(() => {
      console.log('Text copied to clipboard');
      this.toaster.show("Text Copied!")
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  }



}
