import {
  Component,
  OnInit,
  AfterViewInit,
  ChangeDetectorRef,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RentalItemService } from '../../../services/rental-item.service';
import { roomInfo } from '../../../shared/models/roomInfo';
import $ from 'jquery';
import 'slick-carousel';
import { from, Observable, Observer } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-rental-info',
  templateUrl: './rental-info.component.html',
  styleUrls: ['./rental-info.component.scss'],
})
export class RentalInfoComponent implements OnInit, AfterViewInit {
  roomItem: roomInfo | undefined;
  pic: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private rtService: RentalItemService,
    private cdRef: ChangeDetectorRef, // Inject ChangeDetectorRef
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.roomItem = this.rtService.getRoomById(id);
      console.log(this.roomItem);
      if (this.roomItem?.images) {
        this.roomItem.images.forEach((image) => {
          //what is this? It is to get the image from the url and convert it to base64 string
          this.getBase64ImageFromURL(image as string)
            .subscribe({
              next: (data) => this.pic.push(data),
              error: (err) => console.error('圖片加載錯誤:', err),
            })
            .add(console.log(this.roomItem?.images.length));
        });
      }
    } else {
      console.error(`房間資訊未找到，ID: ${id}`);
    }
  }
  //why use Observable and Observer ? Because we need to wait for the image to load before we can get the base64 string
  getBase64ImageFromURL(url: string) {
    return new Observable((observer: Observer<string>) => {
      let img = new Image();
      img.crossOrigin = 'Anonymous'; // crossOrigin avoid from cross different domain warning
      img.src = url; //Anonymous to avoid CORS , (CORS is a security feature that restricts cross-origin HTTP requests.)
      img.onload = () => {
        observer.next(this.getBase64Image(img));
        observer.complete();
      };
    });
  }

  getBase64Image(img: HTMLImageElement) {
    var canvas = document.createElement('canvas'); // canvas is a DOM element can be used to draw images and text
    canvas.width = img.width;
    canvas.height = img.height;
    var ctx = canvas.getContext('2d');
    ctx?.drawImage(img, 0, 0); //ctx is a 2D context for drawing on the canvas
    var dataURL = canvas.toDataURL('image/png');
    return dataURL.replace(/^data:image\/(png|jpg);base64,/, '');
  }
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['roomItem']) {
      this.initializeSlick();
    }
  }
  getSafeUrl(image: string) {
    return this.sanitizer.bypassSecurityTrustUrl(image);
  }
  ngAfterViewInit(): void {
    this.initializeSlick();
    this.cdRef.detectChanges(); // Trigger change detection manually
  }

  private initializeSlick(): void {
    if (this.roomItem && this.roomItem.images) {
    } else {
      console.error('No images available');
      return;
    }

    // Initialize Slick carousel for image slider
    $('.slider-for').each(function () {
      var slider = $(this);
      slider.slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        infinite: false,
        fade: true,
        centerMode: true,
        responsive: [
          {
            breakpoint: 1024,
            settings: { slidesToShow: 1 },
          },
          {
            breakpoint: 650,
            settings: { initialSlide: 2, slidesToShow: 1 },
          },
        ],
        asNavFor: '.slider-nav',
        prevArrow: $('.slick-prev'),
        nextArrow: $('.slick-next'),
      });
    });

    $('.slider-nav').slick({
      slidesToShow: 3,
      slidesToScroll: 1,
      asNavFor: '.slider-for',
      infinite: false,
      
      dots: true,
      arrows: true,
      centerMode: true,
      
      prevArrow: $('.slick-nav-prev'),
      nextArrow: $('.slick-nav-next'),
    });
  }
}
