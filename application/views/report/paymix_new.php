<link rel="stylesheet" href="<?php echo base_url('assets/chartjs') ?>/css/custom.css">
<style>
  #lg-popup {
    position: fixed;
    top: 0;
    height: 100%;
    width: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: 10;
    display: none;
  }
  .lg-popup-graph {
    margin: 10%;
    height: 70vh;
    width: 80vw;
    display: none;
    overflow: hidden;
  }
  </style>
<div class="page-breadcrumb">
    <ol class="breadcrumb container">
      <li><a href="javascript:void(0)"> Analytics/Reports</a></li>
      <li class="active">Allowance Report</li>
    </ol>
  </div>
  <div class="page-title">
    <div class="container">
      <div class="text-center mt-4">
        <h3 id="dashboardTitle" style="margin-bottom:10px">Allowance Report <span style=" float: none;" type="button"
            class="tooltipcls" data-toggle="tooltip control-label" data-placement="bottom" title="" data-original-title=""><i
              class="fa fa-info-circle" aria-hidden="true"></i></span></h3>
      </div>
      <div class="filters mt-4">
        <div class="row align-items-center">
          <div class="col-md-9">
            <div class="row">
              <div class="col-md-1 filter-text" style="max-width: 100px">Filters:</div>
              <div class="col-md-9" id="appliedFilters">
              </div>
            </div>
          </div>
          <div class="col-md-3 text-right">
            <button id="exportPdf" class="btn btn-default">
              <img src="<?php echo base_url('assets/reports') ?>/icons/PDF-Icon.png" alt="download pdf">
            </button>
            <button id="exportCsv" class="btn btn-default">
              <img src="<?php echo base_url('assets/reports') ?>/icons/CSV-Icon.png" alt="download csv">
            </button>
          </div>
        </div>
      </div>
      <div class="row justify-content-center mt-3" id="chartNode">
        <div class="col-md-12">
          <div class="row mt-4">
            <div class="col-md-6">
              <div class="card mb-4">
                <div class="card-body">
                  <div id="country-container" class="w-100" style="height: 400px"></div>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="card mb-4">
                <div class="card-body">
                  <div id="city-container" class="w-100" style="height: 400px"></div>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="card mb-4">
                <div class="card-body">
                  <div id="businessunit-container" class="w-100" style="height: 400px"></div>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="card mb-4">
                <div class="card-body">
                  <div id="grade-container" class="w-100" style="height: 400px"></div>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="card mb-4">
                <div class="card-body">
                  <div id="level-container" class="w-100" style="height: 400px"></div>
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="card mb-4">
                <div class="card-body">
                  <div id="function-container" class="w-100" style="height: 400px"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="pb-4"></div>
    </div>

    
  </div>
  <div id="lg-popup">
    <div id="country-container-lg" class="lg-popup-graph"></div>
    <div id="city-container-lg" class="lg-popup-graph"></div>
    <div id="grade-container-lg" class="lg-popup-graph"></div>
    <div id="level-container-lg" class="lg-popup-graph"></div>
    <div id="function-container-lg" class="lg-popup-graph"></div>
    <div id="businessunit-container-lg" class="lg-popup-graph"></div>
  </div>

<script src="<?php echo base_url('assets/chartjs') ?>/js/highchart.js"></script>
<script src="<?php echo base_url('assets/chartjs') ?>/js/exporting.js"></script>
<script src="<?php echo base_url('assets/chartjs') ?>/js/dom-to-image.min.js"></script>
<script src="<?php echo base_url('assets/chartjs') ?>/js/jspdf.full.min.js"></script>
<script src="<?php echo base_url('assets/chartjs') ?>/js/xlsx.min.js"></script>
<script src="<?php echo base_url('assets/chartjs') ?>/js/lodash.js"></script>
<script src="<?php echo base_url('assets/chartjs') ?>/js/script_paymix_new.js"></script>
  
<script>   
	initialize('<?php echo site_url('api/reports/paymix'); ?>');
</script>

