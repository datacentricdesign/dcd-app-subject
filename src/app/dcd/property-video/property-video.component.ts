import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'dcd-property-video',
  templateUrl: './property-video.component.html',
  styleUrls: ['./property-video.component.css']
})
export class PropertyVideoComponent implements OnInit {

  video: HTMLVideoElement;

  constructor() {
  }

  ngOnInit() {
    this.video = <HTMLVideoElement>document.getElementById("video");
  }


  // static loadVideo(path, from) {
  //   console.log(path);
  //   document.getElementById('video_startTS').textContent = from;
  //   (<HTMLSourceElement>document.getElementById('video_src')).src = path;
  //   (<HTMLVideoElement>document.getElementById('video')).load();
  //   PropertyVideoComponent.setTimelineCenter(from)
  // }

  // switchVideo(n) {
  //   // if (n >= videos.length) n = 0;
  //   //
  //   // var mp4 = document.getElementById("mp4");
  //   // var parent = mp4.parentNode;
  //   //
  //   // document._video.setAttribute("poster", videos[n][0]);
  //   // mp4.setAttribute("src", videos[n][1]);
  //   //
  //   // if (videos[n][2]) {
  //   //   if (webm.parentNode == null) {
  //   //     parent.insertBefore(webm, mp4);
  //   //   }
  //   //   webm.setAttribute("src", videos[n][2]);
  //   // } else {
  //   //   if (webm.parentNode != null) {
  //   //     parent.removeChild(webm);
  //   //   }
  //   // }
  //   // document._video.width = 0;
  //   // document._video.height = 0;
  //   // document._video.load();
  // }

  // static setTimelineCenter(ts) {
  //   console.log(document.getElementById('chart'));
  //   console.log(ts);
  // }

  forward(seconds: number) {
    this.video.currentTime += 10;
  }

  backward(seconds: number) {
    this.video.currentTime -= 10;
  }

  playbackRate(rate: number) {
    this.video.playbackRate += rate;
  }
}
