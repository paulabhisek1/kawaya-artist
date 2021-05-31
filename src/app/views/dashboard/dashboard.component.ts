import { Component, OnInit } from '@angular/core';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { CommonService } from '../../core/services/Common/common.service';
import { Subscription } from 'rxjs';
import { HelperService } from '../../core/services/Helper/helper.service';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

@Component({
  templateUrl: 'dashboard.component.html'
})
export class DashboardComponent implements OnInit {
  subscriptions: Subscription[] = [];

  graphSongFilter: number = 1;
  graphPodcastFilter: number = 1;

  graphSongLoading: boolean = false;
  graphPodcastLoading: boolean = false;
  kpiLoading: boolean = false;


  songGraphData: any = [];
  podcastGraphData: any = [];

  private songChart: am4charts.XYChart;

  songSeries: any = undefined;
  podcastSeries: any = undefined;

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
          console.log("SONG GRAPH : ", result.data);
          result.data.songsGraph.forEach((x, index) => {
            x.date = new Date(x.date);
          })

          this.songGraphData = result.data.songsGraph;
          this.createSongGraph();
        }
        else {
          this.helperService.showError(result.message);
        }
      },(err)=>{
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
          console.log("PODCAST GRAPH : ", result.data);
        }
        else {
          this.helperService.showError(result.message);
        }
      },(err)=>{
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

  createSongGraph() {
    let chart = am4core.create("chartdiv", am4charts.XYChart);
    chart.data = [];

    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.dateFormats.setKey("day", "MMM dd, yyyy");
    dateAxis.renderer.grid.template.location = 0;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.minWidth = 35;

    this.songChart = chart;
    this.updateSongChart();
  }

  updateSongChart() {
    this.songGraphData.forEach((x, index)=>{
      x.color = this.songChart.colors.getIndex(index);
    })

    this.songChart.data = this.songGraphData;
    console.log("CHART : ", this.songChart.data);

     // remove previous series
     if (this.songSeries) {
      this.songChart.series.removeIndex(
        this.songChart.series.indexOf(this.songSeries)
      ).dispose();
    }

    this.songSeries = undefined;

    // Create series
    this.songSeries = this.songChart.series.push(new am4charts.ColumnSeries());
    this.songSeries.dataFields.valueY = "downloadCount";
    this.songSeries.dataFields.dateX = "date";
    this.songSeries.columns.template.stroke = am4core.color("#ff0000"); // Outline
    this.songSeries.columns.template.fill = am4core.color("#f7dcdc"); // Fill
    this.songSeries.propertyFields.stroke = "color";

    var valueLabel = this.songSeries.bullets.push(new am4charts.LabelBullet());
    valueLabel.label.text = "Total Downloads: {downloadCount}, Song Name: {download_song_details.name}";
    valueLabel.label.fontWeight = "500";
    valueLabel.label.fontSize = 20;
    valueLabel.label.paddingTop = 30;

    // Create scrollbars
    this.songChart.scrollbarX = new am4core.Scrollbar();
    this.songChart.scrollbarY = new am4core.Scrollbar();
  }
}
