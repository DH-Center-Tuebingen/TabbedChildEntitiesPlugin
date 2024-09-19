<?php

namespace App\Plugins\TabbedChildEntities\App;

use App\Plugin\Hook;
use App\Plugin\HookRegister;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class Hooks
{    
    protected $table = 'tabbed_child_entities'; // Specify the table name if it's different from the model name

    protected $fillable = [
        'entity_type_id'
    ];
    
    public function __construct() {
        
        $name = 'tabbed_child_entities';
        
        HookRegister::get()->register($name , Hook::ENTITY_TYPE_UPDATE, function(Request $request, JsonResponse $response) use ($name):JsonResponse {

            $entityId = $request->route('id');
            $useTabbedChildren = $request->input("plugin_data.$name.tabbed", false);  
            
            info("HOOK UPDATE: ". $useTabbedChildren);
            TabbedChildEntities::updateData($entityId, $useTabbedChildren);
            return $response;
        });
        
        HookRegister::get()->register($name , Hook::GLOBAL, function(Request $request, JsonResponse $response) use($name) :JsonResponse  {
            $data = $response->getData(true);    
            $ids = array_values(array_map(fn($value):int => $value['id'], $data['entityTypes']));
            $tabbedEntityTypes = TabbedChildEntities::activeIds($ids);
            
            foreach($data['entityTypes'] as $key => $entityType){
                if(!isset($entityType['plugin_data'])){
                    $entityType['plugin_data'] = [];
                }
                
                if(!isset($entityType['plugin_data'][$name])){
                    $entityType['plugin_data'][$name] = [];
                }
                
                $entityType['plugin_data'][$name]['tabbed'] = in_array($entityType['id'], $tabbedEntityTypes);
                $data['entityTypes'][$key] = $entityType;
            }
            
            $response->setData($data);
            return $response;
        });
    }
    

    

    
    
}

