<?php
/* 
 * Generated by CRUDigniter v3.2 
 * www.crudigniter.com
 */
 
class C_and_b extends CI_Controller{
    function __construct()
    {
        parent::__construct();
        $this->load->library('session', 'encrypt');	
		$this->load->library('form_validation');
        $this->load->model('C_and_b_policy_model');
        $this->load->helper(array('form', 'url', 'date'));
		HLP_is_valid_web_token();
    } 

    /*
     * Listing of c_and_b_policies
     */
    function index()
    {
        if(!helper_have_rights(CV_CB_POLOCIES, CV_VIEW_RIGHT_NAME))
		{
			$data['msg'] = '<div class="alert alert-danger alert-dismissible fade in" role="alert" id="notify"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button><b>You do not have view rights.</b></div>';		
            redirect(site_url("dashboard"));
		}
        $data['c_and_b_policies'] = $this->C_and_b_policy_model->get_all_c_and_b_policies();
        $data['title']="C and B";
        $data['body'] = 'c_and_b_policy/index';
        $this->load->view('common/structure',$data);
    }

    /*
     * Adding a new c_and_b_policy
     */
    function add()
    {   
        if(!helper_have_rights(CV_CB_POLOCIES, CV_INSERT_RIGHT_NAME))
		{
			$data['msg'] = '<div class="alert alert-danger alert-dismissible fade in" role="alert" id="notify"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button><b>You do not have insert rights.</b></div>';		
            redirect(site_url("dashboard"));
		}
        
		if($this->input->post())
		{
			$this->form_validation->set_rules('Title', 'Title', 'trim|required|max_length[150]');
			$this->form_validation->set_rules('Description', 'Description', 'trim|required|max_length[500]');
			
			if(empty($_FILES['Document']['name']))
			{
				$this->form_validation->set_rules('Document', 'Document', 'required');
			}
			
			if($this->form_validation->run())
			{
				$upload_arr = HLP_upload_img('Document', "uploads/cnb_policy/",'',array("jpg", "jpeg", "png", "gif","pdf"));
				if(count($upload_arr) == 2)
				{ 
					$f_path = 'uploads/cnb_policy/'. $upload_arr[0];
					$params = array(
									'Title' => $this->input->post('Title'),
									'Description' => $this->input->post('Description'),
									'Document'=>base_url().$f_path
									);
					$c_and_b_policy_id = $this->C_and_b_policy_model->add_c_and_b_policy($params);
            		$this->session->set_flashdata('message', '<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button><b>Data save successfully.</b></div>');
					redirect('c_and_b');
				}
				else
				{
					$this->session->set_flashdata('message', '<div class="alert alert-danger alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button><b>'.$upload_arr[0].'</b></div>');
				}
			}
			else
			{
				$this->session->set_flashdata('message', '<div class="alert alert-danger alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button><b>'.validation_errors().'</b></div>');
			}
			redirect('c_and_b/add');			
		}

		$data['title']="C and B";
		$data['body'] = 'c_and_b_policy/add';
		$this->load->view('common/structure',$data);
    }  

    /*
     * Editing a c_and_b_policy
     */
    function edit($cnbID)
    {   
        if(!helper_have_rights(CV_CB_POLOCIES, CV_INSERT_RIGHT_NAME))
		{
			$data['msg'] = '<div class="alert alert-danger alert-dismissible fade in" role="alert" id="notify"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button><b>You don not have insert rights.</b></div>';		
            redirect(site_url("dashboard"));
		}
        // check if the c_and_b_policy exists before trying to edit it
        $data['c_and_b_policy'] = $this->C_and_b_policy_model->get_c_and_b_policy($cnbID);
        
        if(isset($data['c_and_b_policy']['cnbID']))
        {
			if($this->input->post())
			{
				$this->form_validation->set_rules('Title', 'Title', 'trim|required|max_length[150]');
				$this->form_validation->set_rules('Description', 'Description', 'trim|required|max_length[500]');
				
				if($this->form_validation->run())
				{
					$params = array(
									'Title' => $this->input->post('Title'),
									'Description' => $this->input->post('Description')
									);
					if(!empty($_FILES['Document']['name']))
					{
						$upload_arr = HLP_upload_img('Document', "uploads/cnb_policy/",'',array("jpg", "jpeg", "png", "gif","pdf"));
						if(count($upload_arr) == 2)
						{ 
							$f_path = 'uploads/cnb_policy/'. $upload_arr[0];
							$params['Document'] = base_url().$f_path;
						}
						else
						{
							$this->session->set_flashdata('message', '<div class="alert alert-danger alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button><b>'.$upload_arr[0].'</b></div>');
							redirect('c_and_b/edit/'.$cnbID);
						}
					}
					
					$this->C_and_b_policy_model->update_c_and_b_policy($cnbID,$params);         
					$this->session->set_flashdata('message', '<div class="alert alert-success alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button><b>Data updated successfully.</b></div>');
					redirect('c_and_b');
					
				}
				else
				{
					$this->session->set_flashdata('message', '<div class="alert alert-danger alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button><b>'.validation_errors().'</b></div>');
					redirect('c_and_b/edit/'.$cnbID);
				}					
			}
		
			$data['title']="C and B";
			$data['body'] = 'c_and_b_policy/edit';
			$this->load->view('common/structure',$data);
        }
		else
		{
			$this->session->set_flashdata('message', '<div class="alert alert-danger alert-dismissible fade in" role="alert"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button><b>The c_and_b_policy you are trying to edit does not exist.</b></div>');
			redirect('c_and_b');
		}
    } 

    /*
     * Deleting c_and_b_policy
     */
    function remove($cnbID)
    {
        if(!helper_have_rights(CV_CB_POLOCIES, CV_INSERT_RIGHT_NAME))
		{
			$data['msg'] = '<div class="alert alert-danger alert-dismissible fade in" role="alert" id="notify"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button><b>You do not have insert rights.</b></div>';		
                        redirect(site_url("dashboard"));
		}
        $c_and_b_policy = $this->C_and_b_policy_model->get_c_and_b_policy($cnbID);

        // check if the c_and_b_policy exists before trying to delete it
        if(isset($c_and_b_policy['cnbID']))
        {
            $this->C_and_b_policy_model->delete_c_and_b_policy($cnbID);
            $this->session->set_flashdata('message', '<div class="alert alert-success alert-dismissible fade in" role="alert" id="notify"> <button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">×</span></button><b>Data deleted successfully.</b></div>');
            redirect('c_and_b/index');
        }
        else
            show_error('The c_and_b_policy you are trying to delete does not exist.');
    }
    
}
