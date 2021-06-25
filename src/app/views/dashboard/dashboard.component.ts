import { Component, OnInit, ViewChild } from '@angular/core';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { CommonService } from '../../core/services/Common/common.service';
import { Subscription } from 'rxjs';
import { HelperService } from '../../core/services/Helper/helper.service';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexTitleSubtitle,
  ApexXAxis,
  ApexFill,
  ApexGrid,
  ApexStroke,
  ApexNonAxisChartSeries,
  ApexResponsive,
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  colors: string[];
};

export type ChartOptionsPodcast = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
  colors: string[];
};

export type PieChartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  responsive: ApexResponsive[];
  title: ApexTitleSubtitle;
  labels: any;
  plotOptions: ApexPlotOptions
};

import * as moment from 'moment';

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public chartOptionsSongDownload: Partial<ChartOptions>;
  public chartOptionsSongPlayed: Partial<ChartOptions>;
  public chartOptionsPodcastDownload: Partial<ChartOptionsPodcast>;
  public chartOptionsPodcastPlayed: Partial<ChartOptionsPodcast>;
  public songDownloadPieChart: Partial<PieChartOptions>;
  public songPlayedPieChart: Partial<PieChartOptions>;
  public podcastDownloadPieChart: Partial<PieChartOptions>;
  public podcastPlayedPieChart: Partial<PieChartOptions>;

  subscriptions: Subscription[] = [];

  graphSongFilter: string = '1';
  graphPodcastFilter: string = '1';

  graphSongLoading: boolean = false;
  graphPodcastLoading: boolean = false;
  kpiLoading: boolean = false;

  shwGraph: boolean = false

  songGraphDataArray: any = [];
  songGraphCatArray: any = [];
  songGraphDataArrayPlayed: any = [];

  songDownloadCountSeries: any = undefined;
  songPlayedCountSeries: any = undefined;

  validSongGraph: boolean = false;

  shwGraphPodcasr: boolean = false

  podcastGraphDataArray: any = [];
  podcastGraphCatArray: any = [];
  podcastGraphDataArrayPlayed: any = [];

  podcastDownloadCountSeries: any = undefined;
  podcastPlayedCountSeries: any = undefined;
  podcastSeries: any = undefined;

  podcastChartFilter = '1';

  validPodcastGraph: boolean = false;

  kpiDetails: any = {};


  pieSongPlayedArray: any = [];
  pieSongDownloadArray: any = [];
  piePodcastPlayedArray: any = [];
  piePodcastDownloadArray: any = [];


  chartLoading: boolean = false;
  shwChart: boolean = false;

  totalSongPlayed: number = 0;
  totalSongDownloaded: number = 0;
  totalPodcastPlayed: number = 0;
  totalPodcastDownloaded: number = 0;

  constructor(
    private commonService: CommonService,
    private helperService: HelperService
  ) {
    this.commonService.checkActiveUser();
  }

  ngOnInit(): void {
    this.fetchSongGraph();
    this.fetchPodcastGraph();
    this.fetchDashboardKPI();
    this.fetchDashboardChart();
  }

  changeSongGraphFilter(filterVal) {
    this.shwGraph = false;
    this.graphSongFilter = filterVal;
    this.fetchSongGraph();
  }

  changePodcastGraphFilter(filterVal) {
    this.shwGraphPodcasr = false;
    this.graphPodcastFilter = filterVal;
    this.fetchPodcastGraph();
  }

  fetchSongGraph() {
    let requestConfig = {
      filterType: this.graphSongFilter
    }

    this.graphSongLoading = true;
    this.subscriptions.push(
      this.commonService.getAPICall({
        url: 'song-graph-data',
        data: requestConfig
      }).subscribe((result)=>{
        this.graphSongLoading = false;
        if(result.status == 200) {
          this.validSongGraph = true
          let downloadArray = [];
          let playedArray = [];
          this.songGraphCatArray = [];
          result.data.songsGraph.forEach((x, index) => {
            downloadArray.push(x.downloadCount);
            playedArray.push(x.playedCount);
            this.songGraphCatArray.push(moment(x.date).format('MMM DD'));
          });

          this.songGraphDataArray = [
            {
              name: "Total Downloads",
              data: downloadArray
            }
          ]

          this.songGraphDataArrayPlayed = [
            {
              name: "Total Played",
              data: playedArray
            }
          ]

          this.createSongGraphDownload();
          this.createSongGraphPlayed();

          setTimeout(()=>{
            this.shwGraph = true;
          }, 500);
        }
        else {
          this.validSongGraph = false;
          this.helperService.showError(result.message);
        }
      },(err)=>{
        this.validSongGraph = false;
        this.graphSongLoading = false;
        this.helperService.showError(err.error.message);
      })
    )
  }

  fetchPodcastGraph() {
    let requestConfig = {
      filterType: this.graphPodcastFilter
    }

    this.graphPodcastLoading = true;
    this.subscriptions.push(
      this.commonService.getAPICall({
        url: 'podcast-graph-data',
        data: requestConfig
      }).subscribe((result)=>{
        this.graphPodcastLoading = false;
        if(result.status == 200) {
          if(result.status == 200) {
            this.validPodcastGraph = true
            let downloadArray = [];
            let playedArray = [];
            this.podcastGraphCatArray = [];
            result.data.podcastGraph.forEach((x, index) => {
              downloadArray.push(parseInt(x.downloadCount));
              playedArray.push(parseInt(x.playedCount));
              this.podcastGraphCatArray.push(moment(x.date).format('MMM DD'));
            });
  
            this.podcastGraphDataArray = [
              {
                name: "Total Downloads",
                data: downloadArray
              }
            ]
  
            this.podcastGraphDataArrayPlayed = [
              {
                name: "Total Played",
                data: playedArray
              }
            ]

            this.createPodcastGraphDownload();
            this.createPodcastGraphPlayed();
  
            setTimeout(()=>{
              this.shwGraphPodcasr = true;
            }, 500);
          }
          else {
            this.validPodcastGraph = false;
            this.helperService.showError(result.message);
          }
        }
        else {
          this.helperService.showError(result.message);
        }
      },(err)=>{
        this.validPodcastGraph = false;
        this.graphPodcastLoading = false;
        this.helperService.showError(err.error.message);
      })
    )
  }

  fetchDashboardKPI() {
    this.kpiLoading = true;
    this.subscriptions.push(
      this.commonService.getAPICall({
        url: 'dashboard-data',
      }).subscribe((result)=>{
        this.kpiLoading = false;
        if(result.status == 200) {
          this.kpiDetails = result.data;
          this.kpiDetails.totalRevenue = 0;
        }
        else {
          this.helperService.showError(result.message);
        }
      },(err)=>{
        this.kpiLoading = false;
        this.helperService.showError(err.error.message);
      })
    )
  }

  fetchDashboardChart() {
    this.chartLoading = true;
    this.subscriptions.push(
      this.commonService.getAPICall({
        url: 'dashboard-chart',
      }).subscribe((result)=>{
        this.chartLoading = false;
        if(result.status == 200) {
          this.pieSongPlayedArray = [result.data.song.played.sevenDays, result.data.song.played.fifteenDays, result.data.song.played.thirtyDays];
          this.pieSongDownloadArray = [result.data.song.download.sevenDays, result.data.song.download.fifteenDays, result.data.song.download.thirtyDays];
          this.piePodcastPlayedArray = [result.data.podcast.played.sevenDays, result.data.podcast.played.fifteenDays, result.data.podcast.played.thirtyDays];
          this.piePodcastDownloadArray = [result.data.podcast.download.sevenDays, result.data.podcast.download.fifteenDays, result.data.podcast.download.thirtyDays];

          this.totalSongPlayed = result.data.song.played.sevenDays + result.data.song.played.fifteenDays + result.data.song.played.thirtyDays;
          this.totalPodcastPlayed = result.data.podcast.played.sevenDays + result.data.podcast.played.fifteenDays + result.data.podcast.played.thirtyDays;
          this.totalSongDownloaded = result.data.song.download.sevenDays + result.data.song.download.fifteenDays + result.data.song.download.thirtyDays;
          this.totalPodcastDownloaded = result.data.podcast.download.sevenDays + result.data.podcast.download.fifteenDays + result.data.podcast.download.thirtyDays;

          this.createSongPlayedPieChart();
          this.createSongDownloadPieChart();
          this.createPodcastDownloadPieChart();
          this.createPodcastPlayedPieChart();

          this.shwChart = true;
        }
        else {
          this.helperService.showError(result.message);
        }
      },(err)=>{
        this.chartLoading = false;
        this.helperService.showError(err.error.message);
      })
    )
  }

  createSongGraphDownload() {
    this.shwGraph = true;
    this.chartOptionsSongDownload = {
      series: this.songGraphDataArray,
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: true
      },
      stroke: {
        curve: "smooth"
      },
      colors: ["#6b3f57"],
      title: {
        text: `Total downloads in last ${(this.graphPodcastFilter == '1') ? '7 days' : '30 days'}`,
        align: "left"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
        categories: this.songGraphCatArray
      }
    };
  }

  createSongGraphPlayed() {
    this.shwGraph = true;
    this.chartOptionsSongPlayed = {
      series: this.songGraphDataArrayPlayed,
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: true
      },
      stroke: {
        curve: "smooth"
      },
      title: {
        text: `Total played in last ${(this.graphPodcastFilter == '1') ? '7 days' : '30 days'}`,
        align: "left"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
        categories: this.songGraphCatArray
      }
    };
  }

  createPodcastGraphDownload() {
    this.chartOptionsPodcastDownload = {
      series: this.podcastGraphDataArray,
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false
        }
      },
      dataLabels: {
        enabled: true
      },
      stroke: {
        curve: "smooth"
      },
      title: {
        text: `Total downloads in last ${(this.graphPodcastFilter == '1') ? '7 days' : '30 days'}`,
        align: "left"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
        categories: this.podcastGraphCatArray
      }
    };
  }

  createPodcastGraphPlayed() {
    this.chartOptionsPodcastPlayed = {
      series: this.podcastGraphDataArrayPlayed,
      chart: {
        height: 350,
        type: "line",
        zoom: {
          enabled: false
        },
      },
      dataLabels: {
        enabled: true,
      },
      stroke: {
        curve: "smooth"
      },
      title: {
        text: `Total played in last ${(this.graphPodcastFilter == '1') ? '7 days' : '30 days'}`,
        align: "left"
      },
      grid: {
        row: {
          colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
          opacity: 0.5
        }
      },
      xaxis: {
        categories: this.podcastGraphCatArray
      }
    };
  }

  createSongPlayedPieChart() {
    this.songPlayedPieChart = {
      series: this.pieSongPlayedArray,
      chart: {
        width: 350,
        type: "pie"
      },
      labels: ["7 Days", "15 Days", "30 Days"],
      title: {
        text: `Songs Played Chart`,
        align: "left"
      },
      responsive: [
        {
          breakpoint: 1920,
          options: {
            chart: {
              width: 350
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }

  createSongDownloadPieChart() {
    this.songDownloadPieChart = {
      series: this.pieSongDownloadArray,
      chart: {
        width: 350,
        type: "pie"
      },
      title: {
        text: `Songs Download Chart`,
        align: "left"
      },
      labels: ["7 Days", "15 Days", "30 Days"],
      responsive: [
        {
          breakpoint: 1920,
          options: {
            chart: {
              width: 350
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }

  createPodcastPlayedPieChart() {
    this.podcastPlayedPieChart = {
      series: this.piePodcastPlayedArray,
      chart: {
        width: 350,
        type: "pie"
      },
      title: {
        text: `Podcasts Played Chart`,
        align: "left"
      },
      labels: ["7 Days", "15 Days", "30 Days"],
      responsive: [
        {
          breakpoint: 1920,
          options: {
            chart: {
              width: 350
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ]
    };
  }

  createPodcastDownloadPieChart() {
    this.podcastDownloadPieChart = {
      series: this.piePodcastDownloadArray,
      chart: {
        width: 350,
        type: "pie"
      },
      title: {
        text: `Podcasts Download Chart`,
        align: "left"
      },
      labels: ["7 Days", "15 Days", "30 Days"],
      responsive: [
        {
          breakpoint: 1920,
            options: {
                chart: {
                  width: 350
                },
                legend: {
                  position: "bottom"
                }
            }
          }
      ]
    };
  }
}
