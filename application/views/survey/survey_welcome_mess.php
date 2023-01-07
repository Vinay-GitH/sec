
<div class="page-breadcrumb">
    <div class="col-md-4">
        <ol class="breadcrumb container">
            <li><a href="javascript:void(0)">Survey List</a></li>
            <li class="active"><?php echo (isset($survey[0]['survey_name']))?$survey[0]['survey_name']:""; ?></li>
           
        </ol>
    </div>  
</div>

<div id="main-wrapper" class="container">
<div class="row mb20">
    <div class="col-md-12 ">
        <div class="panel panel-white">
        <?php echo $this->session->flashdata('message'); if(@$msg){echo @$msg;} ?>   
            <?php // echo '<pre />'; print_r($survey); ?>
            <div class="panel-body">
               <div class="survey_wel animated fadeInDown"> 
                <div class="row">
                    <div class="col-sm-12">
                       <div class="welcome box-height">
                           <h3>Welcome</h3>
                           <!-- <h5>Dear Colleagues,</h5> -->
                           <div class="inner-box">
                           <p><?= $survey[0]['description']; ?><br>
                            </p>
                          </div>
                            <!-- <p>Look forward to your candid participation.</p> -->

                            <!-- <p>Best regards,</p> -->

                            <!-- <p>Chief Executive Officer</p> -->

                            <div style="text-align: center;">
                              <span style="font-size: larger; font-weight: 900;">Powered by</span>
                              <img width="75" height="23" src="<?php echo base_url('assets/compport_logo_for_survey.png') ?>">
                              <br>
                <span style="font-size: larger; font-weight: 900;">Check us on <a  target="_blank" href="https://www.compport.com/employee-feedback/">www.compport.com</a></span>
                           </div>
                           <div class="surv_btn" style="margin-top:-25px;">
                           <a href="<?php echo base_url('survey/user-survey-questions/'.$survey_id); ?>" class="btn btn-primary">Start Survey</a>
                           </div>
                       </div>
                    </div>
                </div>
               </div>                
            </div>
        </div>
    </div>
</div>
</div>

<style type="text/css">
.ur_all_survey .usersurvey_dg .catagory_name{ padding:3% 0%;text-align: center; background-color: #<?php echo $this->session->userdata("company_color_ses"); ?>;border-top-left-radius: 6px;     border-top-right-radius: 6px;}
.survey_wel{display: block; width: 100%; padding: 3%; background-color: #fff; border-left: 15px solid #<?php echo $this->session->userdata("company_color_ses");?>;}
</style>
