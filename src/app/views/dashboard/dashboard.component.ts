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
  ApexStroke
} from "ng-apexcharts";

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  title: ApexTitleSubtitle;
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
          console.log("KPI DATA : ", result.data);
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

  createSongGraphDownload() {
    this.shwGraph = true;
    this.chartOptionsSongDownload = {
      series: this.songGraphDataArray,
      chart: {
        height: 350,
        type: "bar"
      },
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 10,
          colors: {
            ranges: [{
                from: 0,
                to: 100,
                color: '#6b3f57'
            }],
            backgroundBarColors: [],
            backgroundBarOpacity: 1,
            backgroundBarRadius: 0,
        },
          columnWidth: '50%',
          dataLabels: {
            position: "top", // top, center, bottom
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function(val) {
          return val + "";
        },
        offsetY: -20,
        style: {
          fontSize: "12px",
          colors: ["#304758"]
        }
      },

      xaxis: {
        categories: this.songGraphCatArray,
        position: "top",
        labels: {
          offsetY: -18
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        crosshairs: {
          fill: {
            type: "solid",
            gradient: {
              colorFrom: "#D8E3F0",
              colorTo: "#BED1E6",
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5
            }
          }
        },
        tooltip: {
          enabled: true,
          offsetY: -35
        }
      },
      fill: {
        type: "solid",
        gradient: {
          shade: "light",
          type: "horizontal",
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [50, 0, 100, 100]
        }
      },
      yaxis: {
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          show: false,
          formatter: function(val) {
            return val + "";
          }
        }
      },
      title: {
        text: `Total downloads in last ${(this.graphSongFilter == '1') ? '7 days' : '30 days'}`,
        floating: false,
        offsetY: 330,
        align: "center",
        style: {
          color: "#444",
        }
      }
    };
  }

  createSongGraphPlayed() {
    this.shwGraph = true;
    this.chartOptionsSongPlayed = {
      series: this.songGraphDataArrayPlayed,
      chart: {
        height: 350,
        type: "bar"
      },
      plotOptions: {
        bar: {
          horizontal: false,
          borderRadius: 10,
          columnWidth: '50%',
          dataLabels: {
            position: "top" // top, center, bottom
          }
        }
      },
      dataLabels: {
        enabled: true,
        formatter: function(val) {
          return val + "";
        },
        offsetY: -20,
        style: {
          fontSize: "12px",
          colors: ["#304758"]
        }
      },

      xaxis: {
        categories: this.songGraphCatArray,
        position: "top",
        labels: {
          offsetY: -18
        },
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        crosshairs: {
          fill: {
            type: "solid",
            gradient: {
              colorFrom: "#D8E3F0",
              colorTo: "#BED1E6",
              stops: [0, 100],
              opacityFrom: 0.4,
              opacityTo: 0.5
            }
          }
        },
        tooltip: {
          enabled: true,
          offsetY: -35
        }
      },
      fill: {
        type: "solid",
        gradient: {
          shade: "light",
          type: "horizontal",
          shadeIntensity: 0.25,
          gradientToColors: undefined,
          inverseColors: true,
          opacityFrom: 1,
          opacityTo: 1,
          stops: [50, 0, 100, 100]
        }
      },
      yaxis: {
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: false
        },
        labels: {
          show: false,
          formatter: function(val) {
            return val + "";
          }
        }
      },
      title: {
        text: `Total played in last ${(this.graphSongFilter == '1') ? '7 days' : '30 days'}`,
        floating: false,
        offsetY: 330,
        align: "center",
        style: {
          color: "#444",
        }
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
}
