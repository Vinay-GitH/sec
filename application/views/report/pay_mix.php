<div class="page-breadcrumb">
    <ol class="breadcrumb container">
        <li><a href="javascript:void(0)"> Analytics/Reports</a></li>
        <li class="active">Pay Mix Report</li>
    </ol>
</div>
<div class="page-title">
<!--<link rel="stylesheet" href="<?php echo base_url('assets/chartjs') ?>/bootstrap/dist/css/bootstrap.min.css">-->
<link rel="stylesheet" href="<?php echo base_url('assets/chartjs') ?>/css/custom.css">
<div class="container">
    <div class="text-center mt-4">
        <?php 
        $tooltip=getToolTip('paymix-report');
              $val=json_decode($tooltip[0]->step);
              ?>
        <h3 id="dashboardTitle" style="margin-bottom:10px">Pay Mix Report <span style=" float: none;" type="button" class="tooltipcls" data-toggle="tooltip control-label" data-placement="bottom" title="" data-original-title="<?php echo $val[0] ?>"><i class="fa fa-info-circle" aria-hidden="true"></i></span></h3>
<!--        <select name="" id="" class="form-control mt-3" style="width: auto; display: inline-block">
            <option value="">Mid year salary review 2018</option>
            <option value="">Mid year salary review 2018</option>
            <option value="">Mid year salary review 2018</option>
        </select>-->
    </div>
    <div class="filters mt-4">
        <div class="row align-items-center">
            <div class="col-md-9">
                <div class="row">
                    <div class="col-md-1 filter-text" style="max-width: 100px">Filters:</div>
                    <div class="col-md-9" id="appliedFilters"></div>
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
                            <div id="countryChart" class="w-100" style="height: 400px"></div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card mb-4">
                        <div class="card-body">
                            <div id="cityChart" class="w-100" style="height: 400px"></div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card mb-4">
                        <div class="card-body">
                            <div id="businessUnit1" class="w-100" style="height: 400px"></div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card mb-4">
                        <div class="card-body">
                            <div id="hcByGrade" class="w-100" style="height: 400px"></div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card mb-4">
                        <div class="card-body">
                            <div id="hcByLevel" class="w-100" style="height: 400px"></div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card mb-4">
                        <div class="card-body">
                            <div id="functionChart" class="w-100" style="height: 400px"></div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="card mb-4">
                        <div class="card-body">
                            <div id="genderChart" class="w-100" style="height: 400px"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="pb-4"></div>
</div>

<div class="loader">
    <img src="<?php echo base_url('assets/reports') ?>/loading.gif" alt="">
</div>
<script>
var GRAPHAPIURL="<?php echo base_url('api/graph/paymix') ?>";
</script>
<!--<script src="<?php echo base_url('assets/chartjs') ?>/js/jquery.min.js"></script>-->
<script src="<?php echo base_url('assets/chartjs') ?>/js/highchart.js"></script>
<script src="<?php echo base_url('assets/chartjs') ?>/js/exporting.js"></script>
<script src="<?php echo base_url('assets/chartjs') ?>/js/dom-to-image.min.js"></script>
<script src="<?php echo base_url('assets/chartjs') ?>/js/jspdf.full.min.js"></script>
<script src="<?php echo base_url('assets/chartjs') ?>/js/xlsx.min.js"></script>
<script src="<?php echo base_url('assets/chartjs') ?>/js/lodash.js"></script>
<!--<script src="<?php echo base_url('assets/chartjs') ?>/js/highchart.js"></script>
<script src="<?php echo base_url('assets/chartjs') ?>/js/highchart3d.js"></script>
<script src="<?php echo base_url('assets/chartjs') ?>/js/exporting.js"></script>
<script src="<?php echo base_url('assets/chartjs') ?>/js/filesaver.js"></script>
<script src="<?php echo base_url('assets/chartjs') ?>/js/dom-to-image.min.js"></script>
<script src="<?php echo base_url('assets/chartjs') ?>/js/jspdf.min.js"></script>
<script src="<?php echo base_url('assets/chartjs') ?>/js/lodash.js"></script>-->
<script src="<?php echo base_url('assets/chartjs') ?>/js/script-paymix.js"></script>
<script>
    
    $(document).ready(function() {
        App(GRAPHAPIURL);
        
    })
</script>
</div>

